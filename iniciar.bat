@echo off
title MedAgenda - Inicializador Rapido
echo ====================================================
echo       MedAgenda - Inicializador Rapido TCC
echo ====================================================
echo.

REM Criando arquivo .env.development no backend se nao existir
if not exist "backend\.env.development" (
    echo [INFO] Criando arquivo de configuracao padrao em backend\.env.development...
    echo JWT_SECRET=medagenda_secret_key_123 > backend\.env.development
    echo PORT=5000 >> backend\.env.development
    echo DB_DIALECT=sqlite >> backend\.env.development
)

echo.
echo [1/3] Instalando dependencias do Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Erro ao instalar dependencias do Backend.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Instalando dependencias do Frontend...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Erro ao instalar dependencias do Frontend.
    pause
    exit /b %errorlevel%
)

echo.
echo ====================================================
echo        MEDAGENDA PRONTO PARA EXECUTAR
echo ====================================================
echo O banco de dados SQLite foi configurado em arquivo local.
echo Nao eh necessario XAMPP ou instalacao de servidores adicionais!
echo O banco sera criado e semeado automaticamente.
echo ====================================================
echo.
echo Pressione qualquer tecla para iniciar o MedAgenda...
echo.
pause

echo Iniciando o Backend em uma nova janela...
cd ../backend
start "MedAgenda Backend" npm start

echo Iniciando o Frontend...
cd ../frontend
npm start
