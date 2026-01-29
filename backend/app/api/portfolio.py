from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.models import Trade, User, UserRole, TradeStatus, TradeType
from app.schemas.schemas import PortfolioSummary
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.get("/{user_id}/summary", response_model=PortfolioSummary)
async def get_portfolio_summary(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get portfolio summary for a user"""
    # Check permissions
    if current_user.role == UserRole.CLIENT and current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Get all user trades
    trades = db.query(Trade).filter(Trade.client_id == user_id).all()
    
    initial = user.initial_deposit
    realized_pnl = 0.0
    unrealized_pnl = 0.0
    total_invested = 0.0
    win_count = 0
    closed_count = 0
    
    for trade in trades:
        # For closed trades, use exit price; for open trades, use current price or entry price
        current_price = trade.exit_price if trade.status == TradeStatus.CLOSED else (trade.current_price or trade.entry_price)
        
        # Calculate PnL based on trade type
        if trade.type == TradeType.LONG:
            diff = current_price - trade.entry_price
        else:  # SHORT
            diff = trade.entry_price - current_price
        
        pnl = diff * trade.quantity
        
        if trade.status == TradeStatus.CLOSED:
            realized_pnl += pnl
            closed_count += 1
            if pnl > 0:
                win_count += 1
        else:
            unrealized_pnl += pnl
            total_invested += trade.entry_price * trade.quantity
    
    total_pnl = realized_pnl + unrealized_pnl
    current_balance = initial + total_pnl
    roi = (total_pnl / initial * 100) if initial > 0 else 0
    win_rate = (win_count / closed_count * 100) if closed_count > 0 else 0
    open_trades_count = len([t for t in trades if t.status == TradeStatus.OPEN])
    
    return PortfolioSummary(
        current_balance=current_balance,
        total_invested=total_invested,
        total_pnl=total_pnl,
        roi=roi,
        win_rate=win_rate,
        open_trades_count=open_trades_count
    )
