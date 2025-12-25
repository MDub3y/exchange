High-Performance Real-Time Trading Engine
============================================

A modular, low-latency trading platform featuring an in-memory order matching engine, real-time WebSocket streaming, and a distributed microservices architecture. Designed for sub-millisecond execution and high-throughput market data visualization.

System Architecture
-----------------------

![Screenshot_2024-06-29_at_3 52 33_PM](https://github.com/user-attachments/assets/3d97bff4-f139-4c3c-8402-fde801147b70)


The system is built as a suite of decoupled services communicating through **Redis** (Queues & Pub/Sub) to ensure high availability and scalability.

*   **API Server:** Handles HTTP requests, authentication (JWT), and acts as a gateway for placing orders.
    
*   **Matching Engine:** The core logic. Maintains order books and user balances **in-memory** for lightning-fast execution.
    
*   **Websocket Server:** Subscribes to engine events via Redis Pub/Sub and streams live market data to clients.
    
*   **DB Processor:** An asynchronous worker that consumes executed trades and events from Redis to persist them in **TimescaleDB**.
    
*   **Market Maker (MM):** A utility service that simulates liquidity by placing automated orders.
    
*   **Frontend:** A modern React/Next.js dashboard for real-time visualization of candles, depth, and trades.
    

Key Features & Engineering Decisions
--------------------------------------

### In-Memory Orderbook & Balances

To achieve high-frequency trading performance, the system avoids database hits during the trade execution path.

*   **In-Memory Matching:** Orders are matched using optimized data structures in RAM.
    
*   **Balance Locking:** When a user places a limit order, their balance is "locked" in-memory immediately to prevent double-spending without the overhead of ACID database transactions.
    
*   **Event Sourcing:** Every state change is pushed to a Redis queue for asynchronous persistence, ensuring the "hot path" remains fast.
    

### Real-Time Data Streaming

The system supports granular WebSocket streams for professional-grade trading interfaces:

*   **Depth:** L2 order book updates.
    
*   **Trades:** Real-time execution notifications.
    
*   **Ticker:** 24h rolling price statistics and graph data.
    

Tech Stack
--------------

*   **Language:** TypeScript
    
*   **Runtime:** Node.js
    
*   **Database:** TimescaleDB (Optimized for time-series trade data)
    
*   **Caching/Messaging:** Redis (Queues & Pub/Sub)
    
*   **Frontend:** React, Next.js, Tailwind CSS
    
*   **Communication:** REST API, WebSockets
    

API Documentation
--------------------
### Authentication

## 

| **Endpoint** | **Method** | **Description** |
| --- | --- | --- |
| /api/v1/signup | POST | Create a new account |
| /api/v1/signin | POST | Authenticate and receive a JWT |

### Trading Operations

## 

| **Endpoint** | **Method** | **Payload** | **Description** |
| --- | --- | --- | --- |
| /api/v1/order | POST | {type, kind, price, quantity, market} | Place a Limit/Market order |
| /api/v1/order/:id | GET | — | Check fill status of an order |
| /api/v1/order/:id | DELETE | — | Cancel an open order |
| /api/v1/order/quote | POST | {kind, quantity, market} | Get a price quote for a market order |


WebSocket API
----------------

Connect to the stream via ws://localhost:PORT.

### Available Streams

*   **Trades:** trades@MARKET (e.g., trades@TATA-INR)
    
*   **Market Depth:** depth@MARKET
    
*   **Ticker Updates:** ticker@MARKET
    

Getting Started
------------------

### Prerequisites

*   Node.js (v18+)
    
*   Redis Instance
    
*   PostgreSQL with TimescaleDB extension
    

### Installation

### 

1.  **Clone the repository:**
    
    Bash
    
        git clone https://github.com/yourusername/trading-engine.git
        cd trading-engine
    
2.  **Install dependencies:**
    
    Bash
    
        npm install
    
3.  **Environment Setup:** Create a `.env` file in each service directory (API, Engine, DB Processor) following the `.env.example`.
    
4.  **Start the services (Development):**
    
    Bash
    
        # Start Redis first
        docker-compose up -d redis timescale
        
        # Run the engine
        cd engine && npm run dev
        
        # Run the API
        cd api && npm run dev
    

Reliability & Scalability
-----------------------------

*   **Redis Queues:** Acts as a buffer between the API and the Engine. If the Engine restarts, it picks up pending orders from the queue.
    
*   **Time-Series Optimization:** TimescaleDB allows for hyper-efficient querying of historical trade data for generating candlestick charts.
