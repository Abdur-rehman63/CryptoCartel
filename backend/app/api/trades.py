from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import secrets
import time

from app.core.database import get_db
from app.models.models import Trade, User, UserRole, TradeStatus
from app.schemas.schemas import TradeCreate, TradeResponse, TradeUpdate
from app.api.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/trades", tags=["Trades"])


@router.post("/", response_model=TradeResponse, status_code=status.HTTP_201_CREATED)
async def create_trade(
    trade_data: TradeCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new trade (admin only)"""
    # Verify client exists
    client = db.query(User).filter(User.id == trade_data.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Create trade
    trade = Trade(
        id=secrets.token_urlsafe(16),
        client_id=trade_data.client_id,
        coin_id=trade_data.coin_id,
        coin_symbol=trade_data.coin_symbol,
        entry_price=trade_data.entry_price,
        quantity=trade_data.quantity,
        type=trade_data.type,
        take_profit=trade_data.take_profit,
        stop_loss=trade_data.stop_loss,
        notes=trade_data.notes,
        status=TradeStatus.OPEN,
        timestamp=int(time.time() * 1000)
    )
    
    db.add(trade)
    db.commit()
    db.refresh(trade)
    
    return trade


@router.get("/", response_model=List[TradeResponse])
async def get_trades(
    client_id: Optional[str] = None,
    status_filter: Optional[TradeStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get trades with optional filters"""
    query = db.query(Trade)
    
    # If client, only show their trades
    if current_user.role == UserRole.CLIENT:
        query = query.filter(Trade.client_id == current_user.id)
    elif client_id:
        # Admin can filter by client
        query = query.filter(Trade.client_id == client_id)
    
    # Apply status filter
    if status_filter:
        query = query.filter(Trade.status == status_filter)
    
    trades = query.order_by(Trade.timestamp.desc()).all()
    return trades


@router.get("/{trade_id}", response_model=TradeResponse)
async def get_trade(
    trade_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get trade by ID"""
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.CLIENT and trade.client_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return trade


@router.put("/{trade_id}", response_model=TradeResponse)
async def update_trade(
    trade_id: str,
    trade_data: TradeUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update trade (admin only)"""
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    
    # Update fields
    if trade_data.current_price is not None:
        trade.current_price = trade_data.current_price
    if trade_data.exit_price is not None:
        trade.exit_price = trade_data.exit_price
    if trade_data.status is not None:
        trade.status = trade_data.status
    if trade_data.take_profit is not None:
        trade.take_profit = trade_data.take_profit
    if trade_data.stop_loss is not None:
        trade.stop_loss = trade_data.stop_loss
    if trade_data.notes is not None:
        trade.notes = trade_data.notes
    if trade_data.closed_at is not None:
        trade.closed_at = trade_data.closed_at
    
    db.commit()
    db.refresh(trade)
    
    return trade


@router.post("/{trade_id}/close", response_model=TradeResponse)
async def close_trade(
    trade_id: str,
    exit_price: float,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Close a trade (admin only)"""
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    
    if trade.status == TradeStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trade is already closed"
        )
    
    # Close trade
    trade.status = TradeStatus.CLOSED
    trade.exit_price = exit_price
    trade.closed_at = int(time.time() * 1000)
    
    db.commit()
    db.refresh(trade)
    
    return trade


@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trade(
    trade_id: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete trade (admin only)"""
    trade = db.query(Trade).filter(Trade.id == trade_id).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    
    db.delete(trade)
    db.commit()
    
    return None
