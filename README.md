## Restaurant Ordering System



### Project Overview
The Restaurant Ordering System is a full-stack web application designed to help restaurant staff manage food orders efficiently. It supports role-based access for waiters, kitchen staff, and managers. Features include secure user login, real-time kitchen updates using WebSockets, and PostgreSQL integration for data management.

---

### Backend Features
- User login and registration
- Role-based access (Waiter, Kitchen Staff, Manager)
- RESTful APIs for orders, menu items, and tables
- WebSocket support for real-time kitchen updates
- PostgreSQL database integration
- Centralized error handling and logging

---

### Frontend Features
- Interfaces for different roles
- Waiters can place and manage orders
- Kitchen staff can view and complete orders
- Managers can monitor all activity
- Responsive UI using JavaScript, HTML, CSS

---

### Technologies Used
- **Backend:** Java, Spring Boot, WebSocket
- **Frontend:** JavaScript, HTML, CSS
- **Database:** PostgreSQL
- **Build Tools:** Gradle (backend), npm (frontend)

---

### How to Run the Project

#### Prerequisites
- Java 17 or newer
- Gradle
- PostgreSQL (You must create it manually):
  - Running on port `5433`
  - Database name: `restaurant_ordering_system`
  - Username: `admin`
  - Password: `admin123`
- Node.js and npm

---

#### Run Instructions

**Start Backend**
cd backend
./gradlew bootRun


**Start Frontend**
cd frontend
npm install
npm start

### Authentication

- Users log in with username and password  
- Role-based access is handled server-side  

---

### Real-Time Updates

- WebSocket notifies kitchen staff when new orders are placed  
- Configuration is defined in `application.properties`  

---

### User Roles

- Waiter: Place and view orders, clean tables  
- Kitchen Staff: View and complete orders  
- Manager: Monitor activity and manage tables/menus  

---

### Testing Overview

The project includes unit and integration tests for backend and frontend components:

- Table Management: Create, update, retrieve, delete tables  
- Authentication: Login, registration, error handling  
- Menu Management: CRUD and filtering  
- Order Management: Create orders, update status, track delivery  
- Kitchen & Manager Dashboards: Real-time and stats  
- Frontend: Route protection, role-based access  

**Tools used:**  
- Backend: JUnit 5, Mockito, Spring Test  
- Frontend: Jest, React Testing Library  

---

### Docker Deployment

This project is designed to run in Docker containers.  
Both backend and frontend can be containerized.  
Docker Compose is recommended to run multiple services like PostgreSQL and the app itself.

---

### Redis Integration 

Redis is used as an in-memory data store to improve performance and support real-time features.

**Usage:**
- Cache order sessions and statuses (e.g., `order:{orderId}`)  
- Auto-expire data after a set time (e.g., 2 hours)  
- Use `RedisTemplate` for object serialization  

**Implementation:**
- Integrated with Spring Data Redis  
- Redis operations: save, retrieve, update, delete order sessions  
- Configuration in `application.properties`  
- Can run locally, in Docker, or remotely  

**Benefits:**
- Reduces database load  
- Enables real-time client updates  
- Supports high-throughput environments  

---

### Redis Debugging (CLI Access in Docker)

To inspect cached order sessions inside Docker Redis container:

docker exec -it restaurant-redis redis-cli keys "order:*"


