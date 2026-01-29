import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestTradeEndpoints:
    """Test trade endpoints"""
    
    def test_create_trade(self, admin_token, client_user):
        """Test creating a trade"""
        response = client.post(
            "/trades/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "client_id": client_user.id,
                "coin_id": "bitcoin",
                "coin_symbol": "BTC",
                "entry_price": 45000.0,
                "quantity": 0.5,
                "type": "LONG",
                "take_profit": 50000.0,
                "stop_loss": 42000.0,
                "notes": "Test trade"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["coin_symbol"] == "BTC"
        assert data["entry_price"] == 45000.0
        assert data["quantity"] == 0.5
        assert data["status"] == "OPEN"
        assert "id" in data
        assert "timestamp" in data
    
    def test_create_trade_as_client(self, client_token, client_user):
        """Test creating trade as client (should fail)"""
        response = client.post(
            "/trades/",
            headers={"Authorization": f"Bearer {client_token}"},
            json={
                "client_id": client_user.id,
                "coin_id": "bitcoin",
                "coin_symbol": "BTC",
                "entry_price": 45000.0,
                "quantity": 0.5,
                "type": "LONG"
            }
        )
        assert response.status_code == 403
    
    def test_create_trade_invalid_client(self, admin_token):
        """Test creating trade with invalid client ID"""
        response = client.post(
            "/trades/",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "client_id": "invalid_id",
                "coin_id": "bitcoin",
                "coin_symbol": "BTC",
                "entry_price": 45000.0,
                "quantity": 0.5,
                "type": "LONG"
            }
        )
        assert response.status_code == 404
    
    def test_get_all_trades_as_admin(self, admin_token, client_user, test_db):
        """Test getting all trades as admin"""
        # Create a trade first
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.get(
            "/trades/",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(t["coin_symbol"] == "BTC" for t in data)
    
    def test_get_trades_as_client(self, client_token, client_user, test_db):
        """Test getting trades as client (only their trades)"""
        # Create a trade for this client
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="ethereum",
            coin_symbol="ETH",
            entry_price=3000.0,
            quantity=2.0,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.get(
            "/trades/",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        # Client should only see their own trades
        assert all(t["client_id"] == client_user.id for t in data)
    
    def test_get_trades_with_status_filter(self, admin_token, client_user, test_db):
        """Test filtering trades by status"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        # Create open trade
        trade1 = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        # Create closed trade
        trade2 = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="ethereum",
            coin_symbol="ETH",
            entry_price=3000.0,
            quantity=1.0,
            type=TradeType.LONG,
            status=TradeStatus.CLOSED,
            exit_price=3200.0,
            timestamp=int(time.time() * 1000),
            closed_at=int(time.time() * 1000)
        )
        test_db.add(trade1)
        test_db.add(trade2)
        test_db.commit()
        
        # Filter for open trades
        response = client.get(
            "/trades/?status_filter=OPEN",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert all(t["status"] == "OPEN" for t in data)
    
    def test_get_trade_by_id(self, admin_token, client_user, test_db):
        """Test getting specific trade"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.get(
            f"/trades/{trade.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == trade.id
        assert data["coin_symbol"] == "BTC"
    
    def test_client_cannot_view_other_trade(self, client_token, admin_user, test_db):
        """Test client cannot view another client's trade"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=admin_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.get(
            f"/trades/{trade.id}",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 403
    
    def test_update_trade(self, admin_token, client_user, test_db):
        """Test updating a trade"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.put(
            f"/trades/{trade.id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "current_price": 46000.0,
                "notes": "Updated notes"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["current_price"] == 46000.0
        assert data["notes"] == "Updated notes"
    
    def test_close_trade(self, admin_token, client_user, test_db):
        """Test closing a trade"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.post(
            f"/trades/{trade.id}/close?exit_price=48000.0",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "CLOSED"
        assert data["exit_price"] == 48000.0
        assert data["closed_at"] is not None
    
    def test_close_already_closed_trade(self, admin_token, client_user, test_db):
        """Test closing an already closed trade"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.CLOSED,
            exit_price=47000.0,
            timestamp=int(time.time() * 1000),
            closed_at=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.post(
            f"/trades/{trade.id}/close?exit_price=48000.0",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 400
    
    def test_delete_trade(self, admin_token, client_user, test_db):
        """Test deleting a trade"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=45000.0,
            quantity=0.5,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        trade_id = trade.id
        
        response = client.delete(
            f"/trades/{trade_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 204
        
        # Verify trade is deleted
        response = client.get(
            f"/trades/{trade_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404
