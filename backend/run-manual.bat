@echo off
echo Starting Restaurant Ordering System (Manual Method)...
echo.

echo Setting up environment...
set CLASSPATH=.;.\classes;.\src\main\resources

echo Compiling the application...
javac -d .\classes -cp "%CLASSPATH%;.\lib\*" src\main\java\com\restaurant\RestaurantApplication.java

if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    pause
    exit /b 1
)

echo Running the application...
java -cp "%CLASSPATH%;.\classes;.\lib\*" com.restaurant.RestaurantApplication

pause 