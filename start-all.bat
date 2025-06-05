@echo off
echo ========================================
echo     INICIANDO MICROSERVICES
echo ========================================
echo.

echo [1/3] Iniciando Book Service (porta 3001)...
start cmd /k "cd apps\book-service && npm run start:dev"

timeout /t 3 /nobreak >nul

echo [2/3] Iniciando Reservation Service (porta 3002)...
start cmd /k "cd apps\reservation-service && npm run start:dev"

timeout /t 3 /nobreak >nul

echo [3/3] Iniciando Frontend (porta 3000)...
start cmd /k "cd apps\frontend && npm run dev"

echo.
echo ========================================
echo   TODOS OS SERVIÇOS FORAM INICIADOS!
echo ========================================
echo.
echo Aguarde alguns segundos e acesse:
echo   Frontend: http://localhost:3000
echo   Book API: http://localhost:3001
echo   Reservation API: http://localhost:3002
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
