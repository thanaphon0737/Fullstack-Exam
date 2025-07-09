# For answer 2 Live Order Monitoring System
## Setup instructions
Follow this steps to running locally
### 1.clone repo
```
git clone https://github.com/thanaphon0737/Fullstack-Exam.git
cd Fullstack-Exam/Answer2/Live-Order-Monitoring-System
```
### 2.configure env variables 
copy from .env.example
- root folder
- gateway
- users-services
- orders-services
- frontend
  - .env.local
### 3.build and run
from root folder
```
docker-compose up --build
```
### 4.running application
- Frontend: ```http://localhost```
- API Gateway: ```http://localhost:3000```

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
## demo
- login ![image](https://github.com/user-attachments/assets/35e54181-2272-4cd9-9f29-449c92471976)
- register ![image](https://github.com/user-attachments/assets/e81969f9-3e17-4aee-88e0-f0617d6cf49e)
- customer ![image](https://github.com/user-attachments/assets/cd076ddc-7a0e-4a77-96db-9d9ea6b4f23e)
- staff ![image](https://github.com/user-attachments/assets/1109cb3a-59a1-4a5a-932e-cf5bf4f7d6a5)
- admin ![image](https://github.com/user-attachments/assets/4f5f8ff1-108a-449a-8fde-a92474f90189)



