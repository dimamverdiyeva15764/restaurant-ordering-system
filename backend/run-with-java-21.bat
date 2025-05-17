@echo off
echo Running Spring Boot application with Java 21...

REM Try to find Java 21 installation
set JAVA_HOME_BACKUP=%JAVA_HOME%

IF EXIST "C:\Program Files\Java\jdk-21" (
    set JAVA_HOME=C:\Program Files\Java\jdk-21
    echo Using Java 21 from: %JAVA_HOME%
) ELSE IF EXIST "C:\Program Files\Java\jdk-21.0.0" (
    set JAVA_HOME=C:\Program Files\Java\jdk-21.0.0
    echo Using Java 21 from: %JAVA_HOME%
) ELSE IF EXIST "C:\Program Files\Java\jdk21" (
    set JAVA_HOME=C:\Program Files\Java\jdk21
    echo Using Java 21 from: %JAVA_HOME%
) ELSE (
    echo WARNING: Could not find Java 21. Using default Java: %JAVA_HOME%
)

REM Print Java version
echo Current Java version:
"%JAVA_HOME%\bin\java" -version

REM Run the application with Gradle wrapper
call ./gradlew bootRun --stacktrace

REM Restore original JAVA_HOME
set JAVA_HOME=%JAVA_HOME_BACKUP%

pause 