from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration"""
    ADMIN = "ADMIN"
    CLIENT = "CLIENT"


class TradeStatus(str, Enum):
    """Trade status enumeration"""
    OPEN = "OPEN"
    CLOSED = "CLOSED"


class TradeType(str, Enum):
    """Trade type enumeration"""
    LONG = "LONG"
    SHORT = "SHORT"


# ===== USER SCHEMAS =====

class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    name: str
    role: UserRole = UserRole.CLIENT
    initial_deposit: float = 0.0


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """Schema for updating a user"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    initial_deposit: Optional[float] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: str
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for authentication token"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ===== TRADE SCHEMAS =====

class TradeBase(BaseModel):
    """Base trade schema"""
    client_id: str
    coin_id: str
    coin_symbol: str
    entry_price: float
    quantity: float
    type: TradeType = TradeType.LONG
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    notes: Optional[str] = None


class TradeCreate(TradeBase):
    """Schema for creating a trade"""
    pass


class TradeUpdate(BaseModel):
    """Schema for updating a trade"""
    current_price: Optional[float] = None
    exit_price: Optional[float] = None
    status: Optional[TradeStatus] = None
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    notes: Optional[str] = None
    closed_at: Optional[int] = None


class TradeResponse(TradeBase):
    """Schema for trade response"""
    id: str
    current_price: Optional[float] = None
    exit_price: Optional[float] = None
    status: TradeStatus
    timestamp: int
    closed_at: Optional[int] = None
    
    class Config:
        from_attributes = True


# ===== ANNOUNCEMENT SCHEMAS =====

class AnnouncementBase(BaseModel):
    """Base announcement schema"""
    title: str
    content: str


class AnnouncementCreate(AnnouncementBase):
    """Schema for creating an announcement"""
    pass


class AnnouncementResponse(AnnouncementBase):
    """Schema for announcement response"""
    id: str
    author_id: str
    timestamp: int
    
    class Config:
        from_attributes = True


# ===== REPLY SCHEMAS =====

class ReplyBase(BaseModel):
    """Base reply schema"""
    announcement_id: str
    content: str


class ReplyCreate(ReplyBase):
    """Schema for creating a reply"""
    pass


class ReplyResponse(ReplyBase):
    """Schema for reply response"""
    id: str
    user_id: str
    user_name: str
    timestamp: int
    
    class Config:
        from_attributes = True


# ===== PORTFOLIO SCHEMAS =====

class PortfolioSummary(BaseModel):
    """Schema for portfolio summary"""
    current_balance: float
    total_invested: float
    total_pnl: float
    roi: float
    win_rate: float
    open_trades_count: int


# ===== COIN PRICE SCHEMAS =====

class CoinPrice(BaseModel):
    """Schema for coin price"""
    id: str
    symbol: str
    name: str
    current_price: float
