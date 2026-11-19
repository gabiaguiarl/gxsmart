@echo off
rem Configura uma unica vez o token da API da Hostinger para o publicar.cmd.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\configurar-token.ps1"
echo.
pause
