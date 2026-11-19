@echo off
rem GX Smart - publica o site em https://novo.gxsmart.com.br pela API da Hostinger (mesmo metodo do MDG).
rem Dois cliques para publicar. Para so gerar o pacote: publicar.cmd -SemEnviar
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publicar.ps1" %*
echo.
pause
