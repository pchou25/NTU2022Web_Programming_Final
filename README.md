# Online Depot

## Web Programming Final Project Group 46

我們設計了一個一頁式網站，方便使用者在公用電腦、他人裝置上透過這個服務把一些小檔案(截圖、文字)暫存到server再下載至自己的裝置。其中server會定期清理暫存檔(預設六小時)，並以BASE64儲存使用者的檔案。

## 功能

由於設計用意是大家可能不想在公共電腦登入自己的雲端帳號等，因此使用者不須預先註冊，只要輸入一組帳號密碼，就可以開始上傳檔案。之後到再另一台裝置可以再使用相同的帳號密碼登入，即可下載剛剛上傳的內容，也有實作相同帳號密碼內新增刪除檔案的即時更新。
另外由於帳號短時間就會重置，可以達到隨意、短期使用的方便性。

## 如何在 localhost 安裝與測試之詳細步驟

> 在repe folder (wp1111/final/) 下執行 yarn install

### Backend

1. cd backend
1. yarn install
1. touch .env 且在.env輸入MONGO_URL
    1. 或在.env_default輸入MONGO_URL
1. yarn server
    - 請確保port 8763原先未被使用

### Frontend

1. cd frontend
1. yarn install
1. yarn start
    - 請確保port 3000原先未被使用