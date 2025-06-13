import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ShoppingCart,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { TicketVerificationApi } from '../services/api';
import type { VerificationStats } from '../types/ticket';

interface VerificationStatsProps {
  concertId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // 秒
}

export const VerificationStatsComponent: React.FC<VerificationStatsProps> = ({ 
  concertId,
  autoRefresh = false,
  refreshInterval = 30
}) => {
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setError('');
      const data = await TicketVerificationApi.getVerificationStats(concertId);
      setStats(data);
      setLastUpdated(new Date());
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [concertId]);

  // 自動刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchStats, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, concertId]);

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  if (loading && !stats) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">載入統計資料失敗</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新載入
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getProgressPercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 標題和刷新按鈕 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">核銷統計</h2>
        </div>
        <div className="flex items-center space-x-4">
          {autoRefresh && (
            <div className="text-sm text-gray-500">
              自動刷新中...
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`
              inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors
              ${loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 總票券數 */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">總票券數</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* 已核銷 */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">已核銷</p>
              <p className="text-2xl font-bold text-green-900">{stats.usedTickets.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2">
            <div className="bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(stats.usedTickets, stats.totalTickets)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 已購買（未核銷） */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">待核銷</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.purchasedTickets.toLocaleString()}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-2">
            <div className="bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(stats.purchasedTickets, stats.totalTickets)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 核銷率 */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">核銷率</p>
              <p className="text-2xl font-bold text-purple-900">{stats.verificationRate}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* 退款資訊 */}
      {stats.refundedTickets > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              已退款票券: {stats.refundedTickets.toLocaleString()} 張
            </span>
          </div>
        </div>
      )}

      {/* 最後更新時間 */}
      <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
        最後更新: {lastUpdated.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
    </div>
  );
};

export default VerificationStatsComponent;
