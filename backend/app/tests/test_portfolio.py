import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestPortfolioEndpoints:
    """Test portfolio analytics endpoints"""
    
    def test_get_portfolio_summary_empty(self, admin_token, client_user):
        """Test portfolio summary with no trades"""
        response = client.get(
            f"/portfolio/{client_user.id}/summary",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["current_balance"] == 10000.0  # Initial deposit
        assert data["total_invested"] == 0.0
        assert data["total_pnl"] == 0.0
        assert data["roi"] == 0.0
        assert data["win_rate"] == 0.0
        assert data["open_trades_count"] == 0
    
    def test_get_portfolio_summary_with_open_trades(self, admin_token, client_user, test_db):
        """Test portfolio summary with open trades"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        # Create profitable open trade
        trade1 = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=40000.0,
            current_price=45000.0,
            quantity=1.0,
            type=TradeType.LONG,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade1)
        test_db.commit()
        
        response = client.get(
            f"/portfolio/{client_user.id}/summary",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["open_trades_count"] == 1
        assert data["total_invested"] == 40000.0
        assert data["total_pnl"] == 5000.0  # (45000 - 40000) * 1
        assert data["current_balance"] == 15000.0  # 10000 + 5000
        assert data["roi"] == 50.0  # 5000/10000 * 100
    
    def test_get_portfolio_summary_with_closed_trades(self, admin_token, client_user, test_db):
        """Test portfolio summary with closed trades"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        # Create winning closed trade
        trade1 = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=40000.0,
            exit_price=45000.0,
            quantity=1.0,
            type=TradeType.LONG,
            status=TradeStatus.CLOSED,
            timestamp=int(time.time() * 1000),
            closed_at=int(time.time() * 1000)
        )
        # Create losing closed trade
        trade2 = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="ethereum",
            coin_symbol="ETH",
            entry_price=3000.0,
            exit_price=2800.0,
            quantity=2.0,
            type=TradeType.LONG,
            status=TradeStatus.CLOSED,
            timestamp=int(time.time() * 1000),
            closed_at=int(time.time() * 1000)
        )
        test_db.add(trade1)
        test_db.add(trade2)
        test_db.commit()
        
        response = client.get(
            f"/portfolio/{client_user.id}/summary",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["open_trades_count"] == 0
        # PnL: (45000-40000)*1 + (2800-3000)*2 = 5000 - 400 = 4600
        assert data["total_pnl"] == 4600.0
        assert data["current_balance"] == 14600.0  # 10000 + 4600
        assert data["win_rate"] == 50.0  # 1 win out of 2 trades
    
    def test_get_portfolio_summary_short_trade(self, admin_token, client_user, test_db):
        """Test portfolio summary with short trades"""
        from app.models.models import Trade, TradeStatus, TradeType
        import secrets
        import time
        
        # Create profitable short trade
        trade = Trade(
            id=secrets.token_urlsafe(16),
            client_id=client_user.id,
            coin_id="bitcoin",
            coin_symbol="BTC",
            entry_price=50000.0,
            current_price=45000.0,
            quantity=1.0,
            type=TradeType.SHORT,
            status=TradeStatus.OPEN,
            timestamp=int(time.time() * 1000)
        )
        test_db.add(trade)
        test_db.commit()
        
        response = client.get(
            f"/portfolio/{client_user.id}/summary",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        # Short PnL: (50000 - 45000) * 1 = 5000
        assert data["total_pnl"] == 5000.0
        assert data["current_balance"] == 15000.0
    
    def test_client_can_view_own_portfolio(self, client_token, client_user):
        """Test client can view their own portfolio"""
        response = client.get(
            f"/portfolio/{client_user.id}/summary",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 200
    
    def test_client_cannot_view_other_portfolio(self, client_token, admin_user):
        """Test client cannot view another user's portfolio"""
        response = client.get(
            f"/portfolio/{admin_user.id}/summary",
            headers={"Authorization": f"Bearer {client_token}"}
        )
        assert response.status_code == 403
    
    def test_portfolio_nonexistent_user(self, admin_token):
        """Test portfolio for nonexistent user"""
        response = client.get(
            "/portfolio/nonexistent_id/summary",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404
