# 🚀 快速啟動指南

## 第一步：安裝依賴
在專案目錄下執行：
```bash
npm install
```

## 第二步：啟動開發服務器
```bash
npm run dev
```

## 第三步：開啟瀏覽器
訪問 `http://localhost:3000`

## 第四步：登入測試
- 帳號：`admin`
- 密碼：`password`

## 🔗 確保後端 API 運行
此前端應用需要 Tickeasy 後端 API 在 `http://localhost:8000` 運行。

如果後端未啟動，統計功能和實際核銷會失敗，但基本的 QR Code 掃描功能仍可測試。

## 📱 功能測試

### 1. QR Code 掃描測試
可以使用以下格式的測試 QR Code：
```
TICKEASY|user123|order456
```

### 2. 模擬核銷流程
1. 進入「掃描核銷」頁面
2. 點擊「開始掃描」
3. 將測試 QR Code 放在相機前
4. 查看票券資訊顯示
5. 點擊「確認核銷」

### 3. 查看統計
進入「統計報告」頁面查看核銷數據

## ⚠️ 注意事項
- 需要允許瀏覽器相機權限
- 建議使用 HTTPS 或 localhost 以確保相機功能正常
- 如果相機無法啟動，可以嘗試重新整理頁面

## 🛠️ 其他指令
```bash
# 建構生產版本
npm run build

# 檢查程式碼格式
npm run lint

# 預覽生產版本
npm run preview
```

愉快測試！ 🎉
