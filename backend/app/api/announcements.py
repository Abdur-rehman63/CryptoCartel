from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import secrets
import time

from app.core.database import get_db
from app.models.models import Announcement, Reply, User
from app.schemas.schemas import (
    AnnouncementCreate, AnnouncementResponse,
    ReplyCreate, ReplyResponse
)
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
async def create_announcement(
    announcement_data: AnnouncementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new announcement"""
    announcement = Announcement(
        id=secrets.token_urlsafe(16),
        title=announcement_data.title.upper(),
        content=announcement_data.content,
        author_id=current_user.id,
        timestamp=int(time.time() * 1000)
    )
    
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    return announcement


@router.get("/", response_model=List[AnnouncementResponse])
async def get_announcements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all announcements"""
    announcements = db.query(Announcement).order_by(Announcement.timestamp.desc()).all()
    return announcements


@router.get("/{announcement_id}", response_model=AnnouncementResponse)
async def get_announcement(
    announcement_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get announcement by ID"""
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )
    
    return announcement


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_announcement(
    announcement_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete announcement (only by author)"""
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )
    
    # Only author can delete
    if announcement.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(announcement)
    db.commit()
    
    return None


# ===== REPLY ENDPOINTS =====

@router.post("/{announcement_id}/replies", response_model=ReplyResponse, status_code=status.HTTP_201_CREATED)
async def create_reply(
    announcement_id: str,
    reply_data: ReplyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a reply to an announcement"""
    # Verify announcement exists
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement not found"
        )
    
    reply = Reply(
        id=secrets.token_urlsafe(16),
        announcement_id=announcement_id,
        user_id=current_user.id,
        user_name=current_user.name,
        content=reply_data.content,
        timestamp=int(time.time() * 1000)
    )
    
    db.add(reply)
    db.commit()
    db.refresh(reply)
    
    return reply


@router.get("/{announcement_id}/replies", response_model=List[ReplyResponse])
async def get_replies(
    announcement_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all replies for an announcement"""
    replies = db.query(Reply).filter(
        Reply.announcement_id == announcement_id
    ).order_by(Reply.timestamp.asc()).all()
    
    return replies


@router.delete("/replies/{reply_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reply(
    reply_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete reply (only by author)"""
    reply = db.query(Reply).filter(Reply.id == reply_id).first()
    
    if not reply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reply not found"
        )
    
    # Only author can delete
    if reply.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(reply)
    db.commit()
    
    return None
