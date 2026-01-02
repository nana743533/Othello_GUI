# Getting Started

## Prerequisites
- Node.js (v20+)
- Ruby (v3.2+) & Rails (v8.1+)
- C++ Compiler (g++ or clang++)
- Docker (Optional, for containerized run)

## Quick Run (Docker)
もしDockerがインストールされていれば、以下のコマンドだけで全ての環境が立ち上がります。

```bash
make up
# Access http://localhost:3000
```

## Manual Setup
手動でセットアップする場合の手順です。

### 1. Backend Setup
```bash
cd backend
bundle install
# C++エンジンのコンパイル
cd othelloai_logic && g++ -O3 -o othello othello.cpp
cd ..
# サーバー起動 (Port: 3001)
bin/rails s -p 3001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# 開発サーバー起動 (Port: 3000)
npm run dev
```

Webブラウザで `http://localhost:3000` にアクセスしてください。
