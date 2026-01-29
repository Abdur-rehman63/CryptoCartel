from sqlalchemy import Column, String, Integer, Float, Enum, ForeignKey, BigInteger, Text
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    ADMIN = "ADMIN"
    CLIENT = "CLIENT"


class TradeStatus(str, enum.Enum):
    """Trade status enumeration"""
    OPEN = "OPEN"
    CLOSED = "CLOSED"


class TradeType(str, enum.Enum):
    """Trade type enumeration"""
    LONG = "LONG"
    SHORT = "SHORT"


class User(Base):
    """User model for both admins and clients"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CLIENT)
    initial_deposit = Column(Float, default=0.0)
    
    # Relationships
    trades = relationship("Trade", back_populates="client", cascade="all, delete-orphan")
    announcements = relationship("Announcement", back_populates="author", cascade="all, delete-orphan")
    replies = relationship("Reply", back_populates="user", cascade="all, delete-orphan")


class Trade(Base):
    """Trade/Position model"""
    __tablename__ = "trades"
    
    id = Column(String, primary_key=True, index=True)
    client_id = Column(String, ForeignKey("users.id"), nullable=False)
    coin_id = Column(String, nullable=False)
    coin_symbol = Column(String, nullable=False)
    entry_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=True)
    exit_price = Column(Float, nullable=True)
    quantity = Column(Float, nullable=False)
    take_profit = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    status = Column(Enum(TradeStatus), nullable=False, default=TradeStatus.OPEN)
    type = Column(Enum(TradeType), nullable=False, default=TradeType.LONG)
    notes = Column(Text, nullable=True)
    timestamp = Column(BigInteger, nullable=False)
    closed_at = Column(BigInteger, nullable=True)
    
    # Relationships
    client = relationship("User", back_populates="trades")


class Announcement(Base):
    """Announcement/Communication model"""
    __tablename__ = "announcements"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    timestamp = Column(BigInteger, nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="announcements")
    replies = relationship("Reply", back_populates="announcement", cascade="all, delete-orphan")


class Reply(Base):
    """Reply to announcement model"""
    __tablename__ = "replies"
    
    id = Column(String, primary_key=True, index=True)
    announcement_id = Column(String, ForeignKey("announcements.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(BigInteger, nullable=False)
    
    # Relationships
    announcement = relationship("Announcement", back_populates="replies")
    user = relationship("User", back_populates="replies")
