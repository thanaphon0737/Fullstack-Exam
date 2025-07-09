# For answer 2 Live Order Monitoring System
## Setup instructions

## Architecture diagram
![diagram](/Answer2/Live-Order-Monitoring-System/fullstack-diagram.drawio.png)
## Service responsibilities
- frontend 
    - [x] Handles users sessions
    - [x] Real-time dashboard monitoring
    - [x] Connect gateway via Websocket
- gateway
    - [x] Single entry point for frontend
    - [x] REST and Websocket APIs
    - [x] Authentication & authorization RBAC JWT
    - [x] Subscribes events from Redis new-order channel
    - [x] Broadcast events to connected dashboard via Websocket
- services/orders-service
    - [x] Manage orders (Create,Update,Delete)
    - [x] Stores order data in PostgreSQL
    - [x] When create new order publish event to Redis channel
- services/users-service
    - [x] handle register,login,roles
    - [x] generate token send to gateway
## WebSocket use case explanation
customer create new order -> gateway -> order-service -> save to PostgreSQL, publish to Redis channel -> gateway receive event from Redis -> broadcast new order via Websocket -> Dashboard update without refreshing
![usecase](/Answer2/Live-Order-Monitoring-System//usecaseSocket.drawio.png)
## Postman
- document [postman document](https://pages.github.com/).
