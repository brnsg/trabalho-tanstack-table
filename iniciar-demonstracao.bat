@echo off
chcp 65001 >nul
title Demonstracao TanStack Table - Brian e Guilherme
cd /d "%~dp0"

echo ==============================================================
echo   TRABALHO #2 - PACOTES EXTRAS: TANSTACK TABLE (TEMA #10)
echo   Integrantes: Brian e Guilherme
echo ==============================================================
echo.

:: Verifica se o Node.js / NPM esta instalado no computador
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js detectado!
    if not exist "node_modules\" (
        echo [1/2] Instalando dependencias do projeto React...
        call npm install
    )
    echo [2/2] Iniciando servidor Vite e abrindo no navegador...
    call npm run dev -- --open
    pause
    exit /b 0
)

:: Caso o computador nao tenha Node.js instalado, abre a versao de navegador direto
echo [INFO] Iniciando demonstracao interativa direto no navegador...
start "" "%~dp0demo-navegador.html"
echo.
echo [OK] Demonstracao aberta no navegador com sucesso!
timeout /t 3 >nul
exit /b 0
