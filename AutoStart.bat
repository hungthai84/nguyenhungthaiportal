@echo off
chcp 65001 >nul
title Nguyen Hung Thai Portal - Auto Start
cd /d "%~dp0"

echo ========================================================
echo        NGUYEN HUNG THAI PORTAL - AUTO START
echo ========================================================
echo.

:: 1. Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Node.js chua duoc cai dat tren may!
    echo Vui long tai va cai dat Node.js tai: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: 2. Kiem tra node_modules
if not exist "node_modules\" (
    echo [THONG BAO] Thu vien chua duoc cai dat. Dang tien hanh npm install...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [LOI] Qua trinh cai dat thu vien gap loi!
        pause
        exit /b 1
    )
)

:: 3. Mo trinh duyet tu dong sau 3 giay
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: 4. Khoi chay Web Server
echo.
echo ========================================================
echo  Website dang khoi dong tai: http://localhost:3000
echo  Trinh duyet se tu dong mo trong giay lat...
echo  Nhan Ctrl + C de dung server khi can.
echo ========================================================
echo.

call npm run dev
pause
