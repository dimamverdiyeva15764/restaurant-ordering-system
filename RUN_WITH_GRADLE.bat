@echo off
echo ================================================
echo Running Restaurant Ordering System with Gradle
echo ================================================
echo.

echo This script will:
echo 1. Start the Spring Boot backend with Gradle
echo 2. Start the React frontend
echo.
echo NOTE: Make sure PostgreSQL is running if using PostgreSQL.
echo By default, the application now uses H2 in-memory database.
echo.

REM Setting up environment
set JAVA_HOME_BACKUP=%JAVA_HOME%

REM Try to find installed Java version
echo Checking for Java installation...
where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java is not installed or not in PATH.
    echo Please install Java 21 and try again.
    pause
    exit /b 1
)

REM Print Java version
echo Current Java version:
java -version
echo.

REM Starting the backend
echo Starting Spring Boot backend with Gradle...
start cmd /k "cd backend && cd && gradlew.bat bootRun"

REM Wait for backend to start
echo Waiting for backend to start (15 seconds)...
timeout /t 15 /nobreak >nul

REM Starting the frontend
echo Starting React frontend...
start cmd /k "cd frontend && cd && npm start"

echo.
echo Both applications should be running now:
echo - Backend: http://localhost:8080 
echo - Frontend: http://localhost:3000
echo.
echo Wait a moment for everything to start, then
echo refresh your browser if needed.
echo.
echo If menu items don't load, check the browser console for errors.
echo.
echo Press any key to exit this script (the applications will continue running)...
pause >nul 