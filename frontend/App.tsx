import React, { useState, useEffect } from 'react';
import { User, UserRole, Trade, TradeStatus, TradeType, PortfolioSummary, Announcement, Reply } from './types';
import { MOCK_CLIENTS, MOCK_ADMIN, INITIAL_TRADES } from './constants';
import { fetchPrices } from './services/cryptoService';
import api from './services/apiService';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/Login';
import AdminOverview from './components/AdminOverview';
import AdminClients from './components/AdminClients';
import ClientDashboard from './components/ClientDashboard';
import CoinsView from './components/CoinsView';
import ReportsView from './components/ReportsView';
import AnnouncementView from './components/AnnouncementView';

enum View {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [clients, setClients] = useState<User[]>(() => {
    const saved = localStorage.getItem('cc_clients');
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });

  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('cc_trades');
    return saved ? JSON.parse(saved) : INITIAL_TRADES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('cc_announcements');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'WELCOME TO CRYPTO CARTEL', content: 'Our new transparency portal is now live. Check your dashboard for real-time updates.', authorId: 'admin', timestamp: Date.now() - 604800000 }
    ];
  });

  const [replies, setReplies] = useState<Reply[]>(() => {
    const saved = localStorage.getItem('cc_replies');
    return saved ? JSON.parse(saved) : [];
  });

  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem('cc_clients', JSON.stringify(clients));
    localStorage.setItem('cc_trades', JSON.stringify(trades));
    localStorage.setItem('cc_announcements', JSON.stringify(announcements));
    localStorage.setItem('cc_replies', JSON.stringify(replies));
  }, [clients, trades, announcements, replies]);

  useEffect(() => {
    // Check for existing session
    const restoreSession = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const response = await api.auth.getCurrentUser();
        if (response.data) {
          const userData = (response.data as any); // Depending on API structure
          // If response.data wraps the user or is the user
          // Based on backend: return user

          const authenticatedUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            initialDeposit: userData.initial_deposit || 0,
            role: userData.role as UserRole
          };

          setUser(authenticatedUser);
          if (authenticatedUser.role === UserRole.ADMIN) {
            setActiveTab('overview');
          } else {
            setActiveTab('dashboard');
          }
          setCurrentView(View.DASHBOARD);
        } else {
          // Token invalid
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        console.error("Session restore failed:", err);
        localStorage.removeItem('auth_token');
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const updatePrices = async () => {
      const coinIds: string[] = Array.from(new Set(trades.map(t => t.coinId)));
      if (coinIds.length > 0) {
        const newPrices = await fetchPrices(coinIds);
        setPrices(prev => ({ ...prev, ...newPrices }));
      }
    };

    // Fetch prices immediately on mount
    updatePrices();

    // Get refresh interval from env (default 10 seconds for near-live updates)
    const refreshInterval = Number(import.meta.env.VITE_PRICE_REFRESH_INTERVAL) || 10000;

    const interval = setInterval(updatePrices, refreshInterval);
    return () => clearInterval(interval);
  }, [trades]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      // Call backend API for authentication
      const response = await api.auth.login(email, pass);

      if (response.error) {
        alert("Login failed: " + response.error);
        return;
      }

      // Get user data from response
      const userData = (response.data as any)?.user;
      if (!userData) {
        alert("Login failed: Invalid response from server");
        return;
      }

      // Set user from API response
      const authenticatedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        initialDeposit: userData.initial_deposit || 0,
        role: userData.role as UserRole
      };

      setUser(authenticatedUser);

      // Set active tab based on role
      if (authenticatedUser.role === UserRole.ADMIN) {
        setActiveTab('overview');
      } else {
        setActiveTab('dashboard');
      }

      setCurrentView(View.DASHBOARD);
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login. Please try again.");
    }
  };

  const calculatePortfolioSummary = (userId: string): PortfolioSummary => {
    const userTrades = trades.filter(t => t.clientId === userId);
    const userObj = clients.find(c => c.id === userId) || user;
    const initial = userObj?.initialDeposit || 0;

    let realizedPnL = 0;
    let unrealizedPnL = 0;
    let totalInvested = 0;
    let winCount = 0;
    let closedCount = 0;

    userTrades.forEach(t => {
      const currentPrice = t.status === TradeStatus.CLOSED ? (t.exitPrice || 0) : (prices[t.coinId] || t.entryPrice);
      const diff = currentPrice - t.entryPrice;
      const pnl = diff * t.quantity;

      if (t.status === TradeStatus.CLOSED) {
        realizedPnL += pnl;
        closedCount++;
        if (pnl > 0) winCount++;
      } else {
        unrealizedPnL += pnl;
        totalInvested += t.entryPrice * t.quantity;
      }
    });

    const totalPnL = realizedPnL + unrealizedPnL;
    return {
      currentBalance: initial + totalPnL,
      totalInvested,
      totalPnL,
      roi: initial > 0 ? (totalPnL / initial) * 100 : 0,
      winRate: closedCount > 0 ? (winCount / closedCount) * 100 : 0,
      openTradesCount: userTrades.filter(t => t.status === TradeStatus.OPEN).length,
    };
  };

  const handlePostReply = (announcementId: string, content: string) => {
    if (!user) return;
    const newReply: Reply = {
      id: Math.random().toString(36).substr(2, 9),
      announcementId,
      userId: user.id,
      userName: user.name,
      content,
      timestamp: Date.now()
    };
    setReplies([...replies, newReply]);
  };

  const handlePostAnnouncement = (title: string, content: string) => {
    const newAnn: Announcement = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.toUpperCase(),
      content,
      authorId: user?.id || 'anonymous',
      timestamp: Date.now()
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <Landing onLoginClick={() => setCurrentView(View.LOGIN)} />;
      case View.LOGIN:
        return <Login onLogin={handleLogin} onBack={() => setCurrentView(View.LANDING)} />;
      case View.DASHBOARD:
        return (
          <Layout
            user={user}
            onLogout={() => { setUser(null); setCurrentView(View.LANDING); }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {user?.role === UserRole.ADMIN ? (
              <>
                {activeTab === 'overview' && (
                  <AdminOverview
                    trades={trades}
                    prices={prices}
                    clients={clients}
                    onCloseTrade={(id) => setTrades(trades.map(t => t.id === id ? { ...t, status: TradeStatus.CLOSED, exitPrice: Number(prompt("Exit Price?")), closedAt: Date.now() } : t))}
                    onDeleteTrade={(id) => setTrades(trades.filter(t => t.id !== id))}
                    onAddTrade={(t) => setTrades([{ ...t, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), status: TradeStatus.OPEN }, ...trades])}
                  />
                )}
                {activeTab === 'clients' && <AdminClients clients={clients} setClients={setClients} trades={trades} />}
                {activeTab === 'announcements' && (
                  <AnnouncementView
                    announcements={announcements}
                    replies={replies}
                    onReply={handlePostReply}
                    isAdmin={true}
                    onPost={handlePostAnnouncement}
                    user={user}
                  />
                )}
              </>
            ) : (
              <>
                {activeTab === 'dashboard' && <ClientDashboard user={user!} trades={trades.filter(t => t.clientId === user?.id)} summary={calculatePortfolioSummary(user!.id)} prices={prices} />}
                {activeTab === 'coins' && <CoinsView trades={trades.filter(t => t.clientId === user?.id)} prices={prices} />}
                {activeTab === 'reports' && <ReportsView user={user!} />}
                {activeTab === 'announcements' && (
                  <AnnouncementView
                    announcements={announcements}
                    replies={replies}
                    onReply={handlePostReply}
                    isAdmin={false}
                    onPost={handlePostAnnouncement}
                    user={user!}
                  />
                )}
              </>
            )}
          </Layout>
        );
    }
  };

  return <div className="min-h-screen font-sans">{renderView()}</div>;
};

export default App;
