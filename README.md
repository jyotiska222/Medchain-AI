# 🧠 Medchain-AI

**Medchain-AI** is a full-stack, browser-based application that leverages AI and blockchain to provide decentralized, intelligent medical diagnostics. The system combines a React/Vite frontend with Web3 wallet integration and a Python-powered AI chatbot backend that processes symptoms and returns medical insights.

---

## 🔍 Project Overview

### 🎯 Purpose

Medchain-AI enables users to:

* Connect a crypto wallet for decentralized identity
* Input medical symptoms
* Get an **AI-powered diagnosis** via a custom chatbot
* View and optionally anchor diagnostic reports on the blockchain

---

## 🤖 ML Chatbot (Core AI Component)

### 💡 What It Does

The **AI Chatbot** is the brain of Medchain-AI. Written in Python, it ingests symptoms and runs lightweight inference on medical datasets to:

* Determine likely diseases
* Estimate severity levels
* Recommend precautions

### 📂 Directory: `mlchatbot/`

#### Key Files:

| File/Dir           | Purpose                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `chat_bot.py`      | Core logic: parses input, runs inference, returns diagnosis + advice |
| `datasets/`        | Contains CSV files: symptoms, diseases, severities, and precautions  |
| `requirements.txt` | Dependencies like `pandas`, `flask`, etc.                            |

#### 📈 Datasets Used:

* `symptom_severity.csv`
* `symptom_precaution.csv`
* `disease_symptom.csv` (or similar)

These datasets are parsed with `pandas` and used to perform basic rule-based or ML-driven inference.

### ⚙️ How It Works

```plaintext
1. User inputs symptoms via the frontend
2. The API sends a POST request to the chatbot
3. The chatbot loads CSVs and runs logic to:
   - Match symptoms to possible diseases
   - Evaluate severity
   - Recommend precautions
4. Returns structured diagnosis to the frontend
```

> The chatbot is designed as a microservice and can be deployed as a Flask app or serverless function.

---

## 💻 Frontend: React + Vite

### Features:

* Pages: `Home`, `Diagnose`, `Profile`, `Report`
* Web3 integration via MetaMask or WalletConnect
* Sends diagnosis requests to the backend
* Displays AI chatbot responses
* Optionally stores report hashes on the blockchain

---

## 🔗 Blockchain Integration

* **Identity:** User signs in with their wallet (e.g., MetaMask)
* **Storage (Planned):** Anchor diagnosis reports or metadata hashes on an EVM-compatible chain (e.g., Ethereum)
* **Optional:** Use IPFS or an off-chain DB for report persistence

---

## 🔧 Project Structure

```plaintext
Medchain-AI/
│
├── frontend/          # React + Vite UI
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── mlchatbot/         # AI-powered Python diagnosis service
│   ├── chat_bot.py
│   ├── datasets/
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js & npm
* Python 3.8+
* MetaMask extension
* Ethereum testnet (optional)

### 🧠 Run Chatbot Locally

```bash
cd mlchatbot
pip install -r requirements.txt
python chat_bot.py
```

### 🌐 Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Architecture Diagram (Planned)

```
[Browser UI] ---> [API Gateway] ---> [ML Chatbot Service] ---> [CSV Datasets]
     |
     +---> [Blockchain Network] (report anchoring)
```

---

## 📌 Roadmap

* [x] Basic symptom diagnosis chatbot
* [ ] API Gateway integration
* [ ] On-chain report storage
* [ ] Switch CSVs to a real database
* [ ] NLP-enhanced chatbot

---

## 🧠 Credits

* Built with ❤️ using Python, React, and decentralized tools.
* Datasets sourced from public medical symptom datasets.

---

## 📜 License

MIT License – feel free to fork, modify, and contribute!
