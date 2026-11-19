@echo off
rem GX Smart - publica o site em https://novo.gxsmart.com.br (Hostinger, FTPS).
rem Dois cliques para publicar. Para so gerar o pacote: publicar.cmd -SemEnviar
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publicar.ps1" %*
echo.
pause
