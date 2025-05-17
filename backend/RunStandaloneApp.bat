@echo off
echo =============================================
echo    STANDALONE SPRING BOOT APPLICATION
echo =============================================
echo.
echo This script will build and run a standalone Spring Boot 
echo application with an embedded database for testing.
echo.
echo Press any key to continue...
pause >nul

REM Create directories if they don't exist
if not exist "standalone" mkdir standalone
cd standalone
if not exist "src\main\java\com\restaurant" mkdir src\main\java\com\restaurant
if not exist "src\main\resources" mkdir src\main\resources

REM Create Application class
echo Creating application files...
echo package com.restaurant;> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo import org.springframework.boot.SpringApplication;>> src\main\java\com\restaurant\StandaloneApp.java
echo import org.springframework.boot.autoconfigure.SpringBootApplication;>> src\main\java\com\restaurant\StandaloneApp.java
echo import org.springframework.web.bind.annotation.*;>> src\main\java\com\restaurant\StandaloneApp.java
echo import java.util.*;>> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo @SpringBootApplication>> src\main\java\com\restaurant\StandaloneApp.java
echo public class StandaloneApp {>> src\main\java\com\restaurant\StandaloneApp.java
echo     public static void main(String[] args) {>> src\main\java\com\restaurant\StandaloneApp.java
echo         SpringApplication.run(StandaloneApp.class, args);>> src\main\java\com\restaurant\StandaloneApp.java
echo     }>> src\main\java\com\restaurant\StandaloneApp.java
echo }>> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo @RestController>> src\main\java\com\restaurant\StandaloneApp.java
echo @RequestMapping("/menu")>> src\main\java\com\restaurant\StandaloneApp.java
echo @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")>> src\main\java\com\restaurant\StandaloneApp.java
echo class MenuController {>> src\main\java\com\restaurant\StandaloneApp.java
echo     @GetMapping>> src\main\java\com\restaurant\StandaloneApp.java
echo     public List<MenuItem> getMenuItems() {>> src\main\java\com\restaurant\StandaloneApp.java
echo         List<MenuItem> menuItems = new ArrayList<>();>> src\main\java\com\restaurant\StandaloneApp.java
echo         menuItems.add(new MenuItem(1L, "Garlic Bread", "Toasted bread with garlic", 4.99, "Appetizers", "https://via.placeholder.com/150", true));>> src\main\java\com\restaurant\StandaloneApp.java
echo         menuItems.add(new MenuItem(2L, "Pizza", "Delicious pizza", 12.99, "Main Courses", "https://via.placeholder.com/150", true));>> src\main\java\com\restaurant\StandaloneApp.java
echo         menuItems.add(new MenuItem(3L, "Ice Cream", "Vanilla ice cream", 3.99, "Desserts", "https://via.placeholder.com/150", true));>> src\main\java\com\restaurant\StandaloneApp.java
echo         return menuItems;>> src\main\java\com\restaurant\StandaloneApp.java
echo     }>> src\main\java\com\restaurant\StandaloneApp.java
echo }>> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo class MenuItem {>> src\main\java\com\restaurant\StandaloneApp.java
echo     private Long id;>> src\main\java\com\restaurant\StandaloneApp.java
echo     private String name;>> src\main\java\com\restaurant\StandaloneApp.java
echo     private String description;>> src\main\java\com\restaurant\StandaloneApp.java
echo     private Double price;>> src\main\java\com\restaurant\StandaloneApp.java
echo     private String category;>> src\main\java\com\restaurant\StandaloneApp.java
echo     private String imageUrl;>> src\main\java\com\restaurant\StandaloneApp.java
echo     private boolean available;>> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo     public MenuItem() {}>> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo     public MenuItem(Long id, String name, String description, Double price, String category, String imageUrl, boolean available) {>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.id = id;>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.name = name;>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.description = description;>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.price = price;>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.category = category;>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.imageUrl = imageUrl;>> src\main\java\com\restaurant\StandaloneApp.java
echo         this.available = available;>> src\main\java\com\restaurant\StandaloneApp.java
echo     }>> src\main\java\com\restaurant\StandaloneApp.java
echo.>> src\main\java\com\restaurant\StandaloneApp.java
echo     public Long getId() { return id; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setId(Long id) { this.id = id; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public String getName() { return name; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setName(String name) { this.name = name; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public String getDescription() { return description; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setDescription(String description) { this.description = description; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public Double getPrice() { return price; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setPrice(Double price) { this.price = price; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public String getCategory() { return category; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setCategory(String category) { this.category = category; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public String getImageUrl() { return imageUrl; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public boolean isAvailable() { return available; }>> src\main\java\com\restaurant\StandaloneApp.java
echo     public void setAvailable(boolean available) { this.available = available; }>> src\main\java\com\restaurant\StandaloneApp.java
echo }>> src\main\java\com\restaurant\StandaloneApp.java

REM Create application.properties
echo Creating application configuration...
echo # Server Configuration> src\main\resources\application.properties
echo server.port=8080>> src\main\resources\application.properties
echo # H2 Database Configuration for in-memory database>> src\main\resources\application.properties
echo spring.datasource.url=jdbc:h2:mem:testdb>> src\main\resources\application.properties
echo spring.datasource.driverClassName=org.h2.Driver>> src\main\resources\application.properties
echo spring.datasource.username=sa>> src\main\resources\application.properties
echo spring.datasource.password=>> src\main\resources\application.properties
echo spring.h2.console.enabled=true>> src\main\resources\application.properties

REM Download dependencies
echo.
echo Downloading Spring Boot dependencies...
if not exist "lib" mkdir lib
curl -s -L -o spring-boot-standalone.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot/3.3.0/spring-boot-3.3.0.jar
curl -s -L -o spring-boot-autoconfigure.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-autoconfigure/3.3.0/spring-boot-autoconfigure-3.3.0.jar
curl -s -L -o spring-boot-starter-web.jar https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-web/3.3.0/spring-boot-starter-web-3.3.0.jar

REM Create a runner script to download and run Spring Boot CLI
echo Creating Spring Boot CLI runner...
echo @echo off> run-standalone.bat
echo echo Starting Standalone Spring Boot Application...>> run-standalone.bat
echo.>> run-standalone.bat
echo REM Download and extract Spring Boot CLI>> run-standalone.bat
echo echo Downloading Spring Boot CLI...>> run-standalone.bat
echo curl -s -L -o spring-cli.zip https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-cli/3.3.0/spring-boot-cli-3.3.0-bin.zip>> run-standalone.bat
echo echo Extracting Spring Boot CLI...>> run-standalone.bat
echo powershell -Command "Expand-Archive -Force 'spring-cli.zip' 'spring-cli'">> run-standalone.bat
echo.>> run-standalone.bat
echo REM Set up path to Spring CLI>> run-standalone.bat
echo set SPRING_CLI_HOME=%%CD%%\spring-cli\spring-3.3.0>> run-standalone.bat
echo set PATH=%%SPRING_CLI_HOME%%\bin;%%PATH%%>> run-standalone.bat
echo.>> run-standalone.bat
echo REM Run the application>> run-standalone.bat
echo echo Starting the application...>> run-standalone.bat
echo spring run --include-path=src/main/resources src/main/java/com/restaurant/StandaloneApp.java>> run-standalone.bat
echo.>> run-standalone.bat
echo pause>> run-standalone.bat

REM Start the application
echo.
echo All files created!
echo.
echo Press any key to run the standalone application...
pause >nul

echo Starting the standalone Spring Boot application...
start cmd /k run-standalone.bat
cd ..

echo.
echo =============================================
echo Standalone application starting...
echo =============================================
echo.
echo Test the API with: http://localhost:8080/menu
echo.
echo Once this is running, your React frontend should be
echo able to connect to this simplified backend.
echo.
echo Wait for the Spring Boot app to start (about 30 seconds),
echo then refresh your React application or restart it.
echo.
echo Press any key to exit this window...
pause >nul 