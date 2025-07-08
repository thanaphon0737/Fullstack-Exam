# For answer 2 Live Order Monitoring System
## Setup instructions
## Architecture diagram
![diagram](/Answer2/Live-Order-Monitoring-System/fullstack-diagram.drawio.png)
## Service responsibilities
- frontend 
    - Handles users sessions
    - Real-time dashboard monitoring
    - Connect gateway via Websocket
- gateway
    - Single entry point for frontend
    - REST and Websocket APIs
    - Authentication & authorization JWT
    - Subscribes events from Redis new-order channel
    - Broadcast events to connected dashboard via Websocket
- services/orders-service
    - Manage orders (Create,Update,Delete)
    - Stores order data in PostgreSQL
    - When create new order publish event to Redis channel
- services/users-service
    - Handles user authentication & authorization with roles
    - Generate JWT for users
## WebSocket use case explanation
customer create new order -> gateway -> order-service -> save to PostgreSQL, publish to Redis channel -> gateway receive event from Redis -> broadcast new order via Websocket -> Dashboard update without refreshing
## Swagger
