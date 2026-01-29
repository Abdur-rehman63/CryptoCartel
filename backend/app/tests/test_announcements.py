import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestAnnouncementEndpoints:
    """Test announcement and reply endpoints"""
    
    def test_create_announcement(self, admin_token):
        """Test creating an announcement"""
        response = client.post(
            "/announcements/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "title": "Important Update",
                "content": "This is a test announcement"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "IMPORTANT UPDATE"  # Should be uppercase
        assert data["content"] == "This is a test announcement"
        assert "id" in data
        assert "timestamp" in data
    
    def test_create_announcement_as_client(self, client_token):
        """Test client can also create announcements"""
        response = client.post(
            "/announcements/",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "title": "Client Message",
                "content": "Message from client"
            }
        )
        assert response.status_code == 201
    
    def test_get_all_announcements(self, admin_token, test_db):
        """Test getting all announcements"""
        from app.models.models import Announcement
        import secrets
        import time
        
        # Create test announcement
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="TEST ANNOUNCEMENT",
            content="Test content",
            author_id="test_author",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        response = client.get(
            "/announcements/",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(a["title"] == "TEST ANNOUNCEMENT" for a in data)
    
    def test_get_announcement_by_id(self, admin_token, test_db):
        """Test getting specific announcement"""
        from app.models.models import Announcement
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="SPECIFIC ANNOUNCEMENT",
            content="Specific content",
            author_id="test_author",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        response = client.get(
            f"/announcements/{announcement.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == announcement.id
        assert data["title"] == "SPECIFIC ANNOUNCEMENT"
    
    def test_get_nonexistent_announcement(self, admin_token):
        """Test getting nonexistent announcement"""
        response = client.get(
            "/announcements/nonexistent_id",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404
    
    def test_delete_announcement_as_author(self, admin_token, admin_user, test_db):
        """Test deleting announcement as author"""
        from app.models.models import Announcement
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="TO DELETE",
            content="Will be deleted",
            author_id=admin_user.id,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        announcement_id = announcement.id
        
        response = client.delete(
            f"/announcements/{announcement_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204
        
        # Verify deleted
        response = client.get(
            f"/announcements/{announcement_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404
    
    def test_delete_announcement_not_author(self, client_token, admin_user, test_db):
        """Test deleting announcement when not author"""
        from app.models.models import Announcement
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="NOT MY ANNOUNCEMENT",
            content="Cannot delete",
            author_id=admin_user.id,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        response = client.delete(
            f"/announcements/{announcement.id}",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 403
    
    def test_create_reply(self, admin_token, test_db):
        """Test creating a reply to announcement"""
        from app.models.models import Announcement
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="ANNOUNCEMENT WITH REPLY",
            content="Original content",
            author_id="test_author",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        response = client.post(
            f"/announcements/{announcement.id}/replies",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "announcement_id": announcement.id,
                "content": "This is a reply"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["content"] == "This is a reply"
        assert data["announcement_id"] == announcement.id
        assert "id" in data
        assert "user_name" in data
    
    def test_create_reply_nonexistent_announcement(self, admin_token):
        """Test creating reply to nonexistent announcement"""
        response = client.post(
            "/announcements/nonexistent_id/replies",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "announcement_id": "nonexistent_id",
                "content": "Reply to nothing"
            }
        )
        assert response.status_code == 404
    
    def test_get_replies(self, admin_token, admin_user, test_db):
        """Test getting all replies for an announcement"""
        from app.models.models import Announcement, Reply
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="ANNOUNCEMENT WITH REPLIES",
            content="Has replies",
            author_id="test_author",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        # Create replies
        reply1 = Reply(
            id=secrets.token_urlsafe(16),
            announcement_id=announcement.id,
            user_id=admin_user.id,
            user_name=admin_user.name,
            content="First reply",
            timestamp=int(time.time() * 1000)
        )
        reply2 = Reply(
            id=secrets.token_urlsafe(16),
            announcement_id=announcement.id,
            user_id=admin_user.id,
            user_name=admin_user.name,
            content="Second reply",
            timestamp=int(time.time() * 1000) + 1000
        )
        test_db.add(reply1)
        test_db.add(reply2)
        test_db.commit()
        
        response = client.get(
            f"/announcements/{announcement.id}/replies",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["content"] == "First reply"
        assert data[1]["content"] == "Second reply"
    
    def test_delete_reply_as_author(self, admin_token, admin_user, test_db):
        """Test deleting reply as author"""
        from app.models.models import Announcement, Reply
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="ANNOUNCEMENT",
            content="Content",
            author_id="test_author",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        reply = Reply(
            id=secrets.token_urlsafe(16),
            announcement_id=announcement.id,
            user_id=admin_user.id,
            user_name=admin_user.name,
            content="Reply to delete",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(reply)
        test_db.commit()
        reply_id = reply.id
        
        response = client.delete(
            f"/announcements/replies/{reply_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204
    
    def test_delete_reply_not_author(self, client_token, admin_user, test_db):
        """Test deleting reply when not author"""
        from app.models.models import Announcement, Reply
        import secrets
        import time
        
        announcement = Announcement(
            id=secrets.token_urlsafe(16),
            title="ANNOUNCEMENT",
            content="Content",
            author_id="test_author",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(announcement)
        test_db.commit()
        
        reply = Reply(
            id=secrets.token_urlsafe(16),
            announcement_id=announcement.id,
            user_id=admin_user.id,
            user_name=admin_user.name,
            content="Not my reply",
            timestamp=int(time.time() * 1000)
        )
        test_db.add(reply)
        test_db.commit()
        
        response = client.delete(
            f"/announcements/replies/{reply.id}",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 403
