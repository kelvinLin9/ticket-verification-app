# Tickeasy 票券核銷系統 (React 測試版)

這是一個基於 React + TypeScript + Vite 的票券核銷系統前端測試應用，專門用來測試 Tickeasy 後端的票券核銷 API。

## 🚀 功能特點

- **QR Code 掃描**: 使用相機掃描票券 QR Code
- **票券驗證**: 即時查詢票券資訊和狀態
- **核銷功能**: 一鍵核銷有效票券
- **統計報表**: 即時查看核銷統計資料
- **響應式設計**: 支援手機和桌面裝置
- **自動刷新**: 統計資料自動更新

## 📋 系統需求

- Node.js 16+ 
- npm 或 yarn
- 現代瀏覽器 (支援相機 API)
- Tickeasy 後端 API (運行在 localhost:8000)

## 🛠️ 安裝與運行

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發服務器

```bash
npm run dev
```

應用將在 `http://localhost:3000` 啟動

### 3. 建構生產版本

```bash
npm run build
```

## 📱 使用說明

### 登入系統
- 測試帳號: `admin`
- 測試密碼: `password`

### 掃描核銷
1. 點擊「掃描核銷」進入掃描頁面
2. 允許瀏覽器訪問相機權限
3. 將相機對準票券 QR Code
4. 系統會自動識別並顯示票券資訊
5. 點擊「確認核銷」完成核銷

### 查看統計
- 在「統計報告」頁面查看即時核銷數據
- 支援自動刷新功能

## 🔧 技術架構

### 前端技術棧
- **React 18**: UI 框架
- **TypeScript**: 類型安全
- **Vite**: 建構工具
- **Tailwind CSS**: 樣式框架
- **React Router**: 路由管理
- **html5-qrcode**: QR Code 掃描
- **Axios**: HTTP 客戶端
- **Lucide React**: 圖標庫

### 專案結構
```
src/
├── components/          # React 組件
│   ├── QrScanner.tsx   # QR Code 掃描器
│   ├── TicketInfo.tsx  # 票券資訊顯示
│   └── VerificationStats.tsx  # 統計報表
├── services/           # API 服務
│   └── api.ts         # API 調用邏輯
├── types/             # TypeScript 類型定義
│   └── ticket.ts     # 票券相關類型
├── styles/           # 樣式文件
│   └── index.css    # 全域樣式
├── App.tsx          # 主應用組件
└── main.tsx        # 應用入口
```

## 🔌 API 整合

此應用預設連接到 `http://localhost:8000/api/v1` 的後端 API。

### 支援的 API 端點:
- `GET /ticket-verification/info/{qrCode}` - 查詢票券資訊
- `POST /ticket-verification/verify` - 核銷票券
- `GET /ticket-verification/stats` - 查詢統計資料

### QR Code 格式
支援的 QR Code 格式: `TICKEASY|{userId}|{orderId}`

## 🔒 安全性

- JWT Token 認證
- 自動 Token 過期處理
- API 請求攔截器
- 防重複掃描機制

## 🎨 自定義樣式

應用使用 Tailwind CSS，可以輕鬆自定義樣式：

- 修改 `tailwind.config.js` 調整主題
- 在 `src/styles/index.css` 添加自定義樣式
- 組件內使用 Tailwind 工具類

## 📱 響應式設計

- 桌面版: 完整功能和佈局
- 平板版: 適配中等螢幕
- 手機版: 觸控優化界面

## 🐛 常見問題

### Q: 相機無法啟動？
A: 請檢查瀏覽器權限設定，確保允許訪問相機

### Q: QR Code 掃描失敗？
A: 確保 QR Code 格式正確 (`TICKEASY|userId|orderId`)

### Q: API 連接失敗？
A: 檢查後端服務是否在 localhost:8000 運行

### Q: 統計資料不更新？
A: 點擊刷新按鈕或等待自動刷新

## 🔄 開發模式

### 本地開發
```bash
npm run dev
```

### 類型檢查
```bash
npm run build
```

### ESLint 檢查
```bash
npm run lint
```

## 📈 效能優化

- 組件懶載入
- API 請求快取
- 圖片優化
- 程式碼分割

## 🤝 貢獻指南

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

此專案為測試用途，僅供學習和開發參考。

## 📞 支援

如有問題或建議，請聯繫開發團隊。

---

**注意**: 這是測試版本，請勿用於生產環境。
#   t i c k e t - v e r i f i c a t i o n - a p p  
 