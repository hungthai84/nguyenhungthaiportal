@echo off
title Nguyễn Hùng Thái Portal - Web Server
chcp 65001 >nul
cd /d "%~dp0"

echo ======================================================================
echo           KHỞI ĐỘNG WEBSITE NGUYỄN HÙNG THÁI PORTAL
echo ======================================================================
echo.

:: 1. Kiem tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Chua cai dat Node.js hoac chua cau hinh PATH!
    echo Vui long tai va cai dat Node.js tai: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Kiem tra thu vien node_modules
if not exist "node_modules\" (
    echo [THONG BAO] Dang tu dong cai dat thu vien (npm install)...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [LOI] Cai dat thu vien that bai! Vui long kiem tra ket noi mang.
        pause
        exit /b 1
    )
    echo [THANH CONG] Da cai dat xong thu vien!
    echo.
)

:: 3. Tu dong mo trinh duyet sau 3 giay
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: 4. Khoi chay Web Server
echo [THONG BAO] Dang khoi chay may chu website...
echo - Dia chi website: http://localhost:3000
echo - Trinh duyet se tu dong mo sau it giay.
echo - De DUNG website: Hay dong cua so nay hoac nhan Ctrl + C.
echo ======================================================================
echo.

call npm run dev

pause
