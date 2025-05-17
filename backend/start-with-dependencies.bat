@echo off
echo Starting Restaurant Backend Server with all dependencies...

REM Download all required JAR files
echo Setting up dependencies (this may take a while)...

REM Create lib directory if it doesn't exist
if not exist "lib" mkdir lib

REM Download Spring Boot dependencies
echo Downloading dependencies...
curl -L -o lib/spring-boot.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot/3.3.0/spring-boot-3.3.0.jar
curl -L -o lib/spring-boot-autoconfigure.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-autoconfigure/3.3.0/spring-boot-autoconfigure-3.3.0.jar
curl -L -o lib/spring-boot-starter-web.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-web/3.3.0/spring-boot-starter-web-3.3.0.jar
curl -L -o lib/spring-boot-starter-data-jpa.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-data-jpa/3.3.0/spring-boot-starter-data-jpa-3.3.0.jar
curl -L -o lib/spring-webmvc.jar https://repo1.maven.org/maven2/org/springframework/spring-webmvc/6.1.5/spring-webmvc-6.1.5.jar
curl -L -o lib/spring-web.jar https://repo1.maven.org/maven2/org/springframework/spring-web/6.1.5/spring-web-6.1.5.jar
curl -L -o lib/spring-context.jar https://repo1.maven.org/maven2/org/springframework/spring-context/6.1.5/spring-context-6.1.5.jar
curl -L -o lib/spring-core.jar https://repo1.maven.org/maven2/org/springframework/spring-core/6.1.5/spring-core-6.1.5.jar
curl -L -o lib/hibernate-core.jar https://repo1.maven.org/maven2/org/hibernate/orm/hibernate-core/6.4.4.Final/hibernate-core-6.4.4.Final.jar
curl -L -o lib/postgresql.jar https://repo1.maven.org/maven2/org/postgresql/postgresql/42.6.0/postgresql-42.6.0.jar

echo Compile the application with dependencies...
if not exist "classes" mkdir classes
javac -d classes -cp "lib/*;src/main/resources" src/main/java/com/restaurant/RestaurantApplication.java

if %ERRORLEVEL% NEQ 0 (
  echo Compilation failed!
  pause
  exit /b 1
)

echo Running the application...
java -cp "classes;lib/*;src/main/resources" com.restaurant.RestaurantApplication

pause 