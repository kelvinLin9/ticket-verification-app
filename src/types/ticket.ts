// 票券狀態
export type TicketStatus = 'purchased' | 'refunded' | 'used';

// 票券資訊
export interface TicketInfo {
  ticketId: string;
  status: TicketStatus;
  concertInfo: {
    conTitle: string;
    sessionTitle: string;
    sessionDate: string;
    venue: {
      venueName: string;
      venueAddress: string;
    };
  };
  verifiedAt?: string;
  verifiedBy?: string;
  verificationLocation?: string;
  note?: string;
}

// API 回應格式
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

// 核銷請求
export interface VerifyTicketRequest {
  qrCode: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  note?: string;
}

// 核銷回應
export interface VerifyTicketResponse {
  success: boolean;
  message: string;
  data?: {
    ticketId: string;
    concertTitle: string;
    verifiedAt: string;
  };
}

// 統計資料
export interface VerificationStats {
  totalTickets: number;
  usedTickets: number;
  purchasedTickets: number;
  refundedTickets: number;
  verificationRate: string;
}

// QR Code 掃描結果
export interface QrScanResult {
  qrCode: string;
  isValid: boolean;
  userId?: string;
  orderId?: string;
}
