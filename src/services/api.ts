import axios from 'axios';
import type { 
  TicketInfo, 
  ApiResponse, 
  VerifyTicketRequest, 
  VerifyTicketResponse, 
  VerificationStats 
} from '../types/ticket';

// 創建 axios 實例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加認證 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器 - 統一錯誤處理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 未授權，清除 token 並跳轉到登入頁
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 服務類別
export class TicketVerificationApi {
  /**
   * 查詢票券資訊
   */
  static async getTicketInfo(qrCode: string): Promise<TicketInfo> {
    try {
      const response = await api.get<ApiResponse<TicketInfo>>(
        `/ticket-verification/info/${encodeURIComponent(qrCode)}`
      );
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '查詢票券資訊失敗');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '網路錯誤，請稍後再試');
    }
  }

  /**
   * 核銷票券
   */
  static async verifyTicket(request: VerifyTicketRequest): Promise<VerifyTicketResponse> {
    try {
      const response = await api.post<VerifyTicketResponse>(
        '/ticket-verification/verify',
        request
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '核銷失敗，請稍後再試');
    }
  }

  /**
   * 查詢核銷統計
   */
  static async getVerificationStats(concertId?: string): Promise<VerificationStats> {
    try {
      const params = concertId ? { concertId } : {};
      const response = await api.get<ApiResponse<VerificationStats>>(
        '/ticket-verification/stats',
        { params }
      );
      
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '查詢統計資料失敗');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '網路錯誤，請稍後再試');
    }
  }

  /**
   * 模擬登入（測試用）
   */
  static async login(username: string, password: string): Promise<{ token: string }> {
    try {
      // 這裡是模擬的登入邏輯
      if (username === 'admin' && password === 'password') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('authToken', mockToken);
        return { token: mockToken };
      } else {
        throw new Error('帳號或密碼錯誤');
      }
    } catch (error: any) {
      throw new Error(error.message || '登入失敗');
    }
  }

  /**
   * 登出
   */
  static logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * 檢查是否已登入
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

// 工具函數：解析 QR Code
export function parseQrCode(qrCode: string): { 
  isValid: boolean; 
  userId?: string; 
  orderId?: string; 
} {
  try {
    // 檢查是否為 TICKEASY 格式：TICKEASY|{userId}|{orderId}
    const parts = qrCode.split('|');
    
    if (parts.length === 3 && parts[0] === 'TICKEASY') {
      return {
        isValid: true,
        userId: parts[1],
        orderId: parts[2],
      };
    }
    
    return { isValid: false };
  } catch (error) {
    return { isValid: false };
  }
}

export default TicketVerificationApi;
