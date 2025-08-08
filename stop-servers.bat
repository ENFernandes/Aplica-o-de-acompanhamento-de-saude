@echo off
echo ========================================
echo    Parando Servidores
echo ========================================
echo.

echo Parando todos os processos Node.js...
taskkill /f /im node.exe

echo.
echo ========================================
echo    Servidores parados!
echo ========================================
echo.
echo Pressione qualquer tecla para sair...
pause > nul
