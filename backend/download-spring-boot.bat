@echo off
echo ===============================================
echo Downloading Spring Boot Application Runner
echo ===============================================
echo.

REM Create lib directory if it doesn't exist
if not exist "lib" mkdir lib

echo Downloading Spring Boot CLI...
curl -L -o spring-boot-cli.zip https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-cli/3.3.0/spring-boot-cli-3.3.0-bin.zip

echo Extracting...
powershell -Command "Expand-Archive -Force 'spring-boot-cli.zip' 'spring-boot-cli'"

echo Creating application runner...
echo @echo off > run-spring-boot.bat
echo echo Starting Spring Boot application... >> run-spring-boot.bat
echo cd %~dp0 >> run-spring-boot.bat
echo set SPRING_BOOT_HOME=%~dp0spring-boot-cli\spring-3.3.0 >> run-spring-boot.bat
echo set PATH=%%SPRING_BOOT_HOME%%\bin;%%PATH%% >> run-spring-boot.bat
echo spring run src/main/java/com/restaurant/RestaurantApplication.java --include-path=src/main/resources >> run-spring-boot.bat
echo pause >> run-spring-boot.bat

echo Done! Run run-spring-boot.bat to start the application.
pause 