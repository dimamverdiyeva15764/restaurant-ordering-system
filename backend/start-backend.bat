@echo off
echo Starting Restaurant Backend Server...

REM Create classes directory if it doesn't exist
if not exist "classes" mkdir classes

REM Try to compile and run directly with Java
echo Compiling Java files...
javac -d classes -cp .;./src/main/resources ./src/main/java/com/restaurant/RestaurantApplication.java

if %ERRORLEVEL% NEQ 0 (
  echo Compilation failed!
  pause
  exit /b 1
)

echo Starting the server...
java -cp classes;./src/main/resources com.restaurant.RestaurantApplication

pause 