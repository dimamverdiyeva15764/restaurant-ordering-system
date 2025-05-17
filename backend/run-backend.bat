@echo off 
echo Starting Backend Server... 
echo. 
echo IMPORTANT: Make sure PostgreSQL is running with database 'restaurant_db' 
cd %~dp0 
 
echo Using Spring Boot CLI to run the application... 
curl -s -o spring-cli.zip https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-cli/3.3.0/spring-boot-cli-3.3.0-bin.zip 
powershell -Command "Expand-Archive -Force 'spring-cli.zip' 'spring-cli'" 
set SPRING_CLI_HOME=%~dp0spring-cli\spring-3.3.0 
set PATH=%SPRING_CLI_HOME%\bin;%PATH% 
echo. 
spring run --include-path=src/main/resources src/main/java/com/restaurant/RestaurantApplication.java 
pause 
