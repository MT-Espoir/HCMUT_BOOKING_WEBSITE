@echo off
echo ========================================
echo Database Sync Tool for CNPM Project
echo ========================================
echo.

set MYSQL_BIN=C:\xampp\mysql\bin
set EXPORT_PATH=%~dp0cnpm_export.sql

:MENU
echo Choose an option:
echo 1. Export database (for sharing)
echo 2. Import database (from shared file)
echo 3. Exit
echo.

set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" goto EXPORT
if "%choice%"=="2" goto IMPORT
if "%choice%"=="3" goto END

echo Invalid choice. Please try again.
echo.
goto MENU

:EXPORT
echo.
echo Exporting database CNPM...
echo.

set /p password=Enter MySQL password (leave empty if none): 

if "%password%"=="" (
    "%MYSQL_BIN%\mysqldump" -u root CNPM > "%EXPORT_PATH%"
) else (
    "%MYSQL_BIN%\mysqldump" -u root -p%password% CNPM > "%EXPORT_PATH%"
)

if %ERRORLEVEL% NEQ 0 (
    echo Error exporting database. Please check if XAMPP is running and try again.
) else (
    echo Database exported successfully to: %EXPORT_PATH%
)

echo.
goto MENU

:IMPORT
echo.
echo Importing database CNPM...
echo.

if not exist "%EXPORT_PATH%" (
    echo Error: Import file not found at %EXPORT_PATH%
    echo Please export the database first or place the file in the correct location.
    echo.
    goto MENU
)

set /p password=Enter MySQL password (leave empty if none): 

echo Creating database CNPM if it doesn't exist...

if "%password%"=="" (
    "%MYSQL_BIN%\mysql" -u root -e "CREATE DATABASE IF NOT EXISTS CNPM;"
    "%MYSQL_BIN%\mysql" -u root CNPM < "%EXPORT_PATH%"
) else (
    "%MYSQL_BIN%\mysql" -u root -p%password% -e "CREATE DATABASE IF NOT EXISTS CNPM;"
    "%MYSQL_BIN%\mysql" -u root -p%password% CNPM < "%EXPORT_PATH%"
)

if %ERRORLEVEL% NEQ 0 (
    echo Error importing database. Please check if XAMPP is running and try again.
) else (
    echo Database imported successfully!
)

echo.
goto MENU

:END
echo.
echo Exiting Database Sync Tool...
echo Thank you for using the tool!
echo.
pause