import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Home, 
  QrCode, 
  BarChart3, 
  LogOut, 
  User,
  Settings,
  Menu,
  X
} from 'lucide-react';
import QrScanner from './components/QrScanner';
import TicketInfoComponent from './components/TicketInfo';
import VerificationStatsComponent from './components/VerificationStats';
import { TicketVerificationApi } from './services/api';
import type { TicketInfo, VerifyTicketRequest } from './types/ticket';
import './styles/index.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    TicketVerificationApi.isAuthenticated()
  );

  const handleLogin = async (username: string, password: string) => {
    try {
      await TicketVerificationApi.login(username, password);
      setIsAuthenticated(true);
    } catch (error: any) {
      throw error;
    }
  };

  const handleLogout = () => {
    TicketVerificationApi.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// 登入頁面
const LoginPage: React.FC<{ onLogin: (username: string, password: string) => Promise<void> }> = ({ 
  onLogin 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(username, password);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Tickeasy 核銷系統</h1>
          <p className="text-gray-600">請輸入您的帳號密碼登入</p>
        </div>

        {error && (
          <div className="error-message mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              帳號
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入帳號"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入密碼"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-all
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              } 
              text-white
            `}
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2 inline-block"></div>
                登入中...
              </>
            ) : (
              '登入'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>測試帳號: admin</p>
          <p>測試密碼: password</p>
        </div>
      </div>
    </div>
  );
};

// 導航組件
const Navigation: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <QrCode className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Tickeasy 核銷</span>
          </div>

          {/* 桌面版導航 */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="w-5 h-5" />
              <span>首頁</span>
            </Link>
            <Link to="/scan" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <QrCode className="w-5 h-5" />
              <span>掃描核銷</span>
            </Link>
            <Link to="/stats" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>統計報告</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>登出</span>
            </button>
          </div>

          {/* 手機版選單按鈕 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 手機版導航選單 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>首頁</span>
              </Link>
              <Link 
                to="/scan" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <QrCode className="w-5 h-5" />
                <span>掃描核銷</span>
              </Link>
              <Link 
                to="/stats" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5" />
                <span>統計報告</span>
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>登出</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// 首頁
const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          歡迎使用 Tickeasy 票券核銷系統
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          這是一個專為演唱會、活動等票券核銷設計的系統。您可以透過 QR Code 掃描快速核銷票券，
          並即時查看核銷統計資料。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link 
          to="/scan"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow block group"
        >
          <div className="text-center">
            <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">開始掃描</h2>
            <p className="text-gray-600">掃描票券 QR Code 進行核銷</p>
          </div>
        </Link>

        <Link 
          to="/stats"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow block group"
        >
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">查看統計</h2>
            <p className="text-gray-600">檢視核銷進度和統計報告</p>
          </div>
        </Link>
      </div>

      {/* 快速統計預覽 */}
      <VerificationStatsComponent autoRefresh />
    </div>
  );
};

// 掃描頁面
const ScanPage: React.FC = () => {
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isScannerActive, setIsScannerActive] = useState(true);

  const handleScan = useCallback(async (qrCode: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    setIsScannerActive(false);

    try {
      const ticket = await TicketVerificationApi.getTicketInfo(qrCode);
      setTicketInfo(ticket);
    } catch (error: any) {
      setError(error.message);
      setTicketInfo(null);
      // 錯誤後重新啟動掃描器
      setTimeout(() => setIsScannerActive(true), 2000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVerify = async () => {
    if (!ticketInfo) return;

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const request: VerifyTicketRequest = {
        qrCode: `TICKEASY|${ticketInfo.ticketId}`, // 這裡需要重建 QR Code 格式
        location: '入口檢查點',
        note: '正常核銷'
      };

      const result = await TicketVerificationApi.verifyTicket(request);
      
      if (result.success) {
        setSuccess(result.message);
        // 重新獲取票券資訊以更新狀態
        setTimeout(() => {
          setTicketInfo(null);
          setIsScannerActive(true);
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNewScan = () => {
    setTicketInfo(null);
    setError('');
    setSuccess('');
    setIsScannerActive(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">票券掃描核銷</h1>
        <p className="text-gray-600">
          請將相機對準票券上的 QR Code 進行掃描
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 掃描器區域 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">QR Code 掃描器</h2>
          
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="loading-spinner mx-auto mb-4 w-8 h-8"></div>
              <p>正在查詢票券資訊...</p>
            </div>
          ) : (
            <QrScanner
              onScan={handleScan}
              onError={setError}
              isActive={isScannerActive}
            />
          )}

          {ticketInfo && (
            <div className="text-center">
              <button
                onClick={handleNewScan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                掃描新票券
              </button>
            </div>
          )}
        </div>

        {/* 票券資訊區域 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">票券資訊</h2>
          
          {ticketInfo ? (
            <TicketInfoComponent
              ticket={ticketInfo}
              onVerify={handleVerify}
              isVerifying={isVerifying}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              <QrCode className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>請掃描 QR Code 查看票券資訊</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 統計頁面
const StatsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">核銷統計報告</h1>
        <p className="text-gray-600">
          查看票券核銷的即時統計資料和分析
        </p>
      </div>

      <VerificationStatsComponent autoRefresh refreshInterval={10} />
    </div>
  );
};

export default App;
