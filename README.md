# Restaurant Ordering System

A web-based ordering system for restaurants with QR code table scanning.

## Features
- QR code table scanning for table identification
- Digital menu with categories
- Shopping cart functionality
- Order placement and processing
- Real-time order tracking for customers

## Project Structure
- `frontend/` - React frontend (Material-UI)
- `backend/` - Spring Boot backend (Gradle)
- `simple-backend/` - Node.js Express server (alternative)

## Tech Stack
- **Frontend:** React with Material-UI
- **Backend Options:**
  - Original: Java Spring Boot with Gradle
  - Simplified: Node.js Express server
- **Database:** 
  - Spring Boot: H2 (default) or PostgreSQL
  - Express: In-memory data

## Running the Application

### One-Click Startup
Double-click `RUN_WITH_GRADLE.bat` in the project root.

### Manual Startup

#### Start the Backend
```
# Command Prompt
cd backend
gradlew bootRun

# PowerShell
cd backend
.\gradlew bootRun
```

#### Start the Frontend
In a new terminal:
```
cd frontend
npm start
```

#### Alternative: Express Backend
```
cd simple-backend
node server.js
```

## Accessing the Application
Once both servers are running:
- Open your browser to http://localhost:3000
- Browse the menu, add items to your cart
- Place orders and track their status

## Switching to PostgreSQL (Optional)
By default, the Spring Boot application uses an H2 in-memory database. To use PostgreSQL:

1. Ensure PostgreSQL is installed and running
2. Create a database named `restaurant_db`
3. Edit `backend/src/main/resources/application.properties`:
   - Comment out the H2 configuration section
   - Uncomment the PostgreSQL configuration section
4. Update the PostgreSQL credentials if necessary

## Troubleshooting
- In PowerShell, use semicolons (`;`) instead of `&&`
- Backend runs on http://localhost:8080
- Frontend runs on http://localhost:3000
- If menu items don't display, check that the backend server is running correctly
- For image loading issues, verify your internet connection
- Check console logs (browser developer tools) for error messages
- If using Java 21 or higher with Gradle, ensure compatibility settings in build.gradle 