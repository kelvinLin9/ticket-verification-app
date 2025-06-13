import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Ticket
} from 'lucide-react';
import type { TicketInfo, TicketStatus } from '../types/ticket';

interface TicketInfoProps {
  ticket: TicketInfo;
  onVerify?: () => void;
  isVerifying?: boolean;
}

export const TicketInfoComponent: React.FC<TicketInfoProps> = ({ 
  ticket, 
  onVerify, 
  isVerifying = false 
}) => {
  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'purchased':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'used':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'refunded':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (status: TicketStatus) => {
    switch (status) {
      case 'purchased':
        return '已購買';
      case 'used':
        return '已使用';
      case 'refunded':
        return '已退款';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const canVerify = ticket.status === 'purchased';

  return (
    <div className={`ticket-card ${ticket.status} fade-in`}>
      {/* 票券標題 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Ticket className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {ticket.concertInfo.conTitle}
            </h2>
            <p className="text-gray-600">
              {ticket.concertInfo.sessionTitle}
            </p>
          </div>
        </div>
        
        {/* 狀態徽章 */}
        <div className={`status-badge ${ticket.status}`}>
          {getStatusIcon(ticket.status)}
          <span className="ml-1">{getStatusText(ticket.status)}</span>
        </div>
      </div>

      {/* 演出資訊 */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-gray-700">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>{formatDate(ticket.concertInfo.sessionDate)}</span>
        </div>
        
        <div className="flex items-start space-x-3 text-gray-700">
          <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <div className="font-medium">{ticket.concertInfo.venue.venueName}</div>
            <div className="text-sm text-gray-600">
              {ticket.concertInfo.venue.venueAddress}
            </div>
          </div>
        </div>
      </div>

      {/* 票券詳細資訊 */}
      <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
        <div className="text-sm text-gray-600 space-y-1">
          <div>票券編號: {ticket.ticketId}</div>
        </div>
      </div>

      {/* 核銷資訊 */}
      {ticket.status === 'used' && ticket.verifiedAt && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">已核銷</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>核銷時間: {formatDate(ticket.verifiedAt)}</span>
            </div>
            {ticket.verificationLocation && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>核銷地點: {ticket.verificationLocation}</span>
              </div>
            )}
            {ticket.verifiedBy && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>核銷人員: {ticket.verifiedBy}</span>
              </div>
            )}
            {ticket.note && (
              <div className="mt-2">
                <span className="font-medium">備註: </span>
                <span>{ticket.note}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 核銷按鈕 */}
      {canVerify && onVerify && (
        <div className="flex justify-end">
          <button
            onClick={onVerify}
            disabled={isVerifying}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-all
              ${isVerifying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
              } 
              text-white shadow-lg hover:shadow-xl
            `}
          >
            {isVerifying ? (
              <>
                <div className="loading-spinner mr-2"></div>
                核銷中...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                確認核銷
              </>
            )}
          </button>
        </div>
      )}

      {/* 不可核銷的提示 */}
      {!canVerify && (
        <div className="text-center py-3">
          {ticket.status === 'used' && (
            <p className="text-green-700 font-medium">此票券已經核銷過了</p>
          )}
          {ticket.status === 'refunded' && (
            <p className="text-red-700 font-medium">此票券已退款，無法核銷</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketInfoComponent;
