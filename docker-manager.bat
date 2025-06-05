@echo off
echo === Microservice Docker Manager ===
echo.
echo 1. Start all services (Production)
echo 2. Start all services (Development)
echo 3. Stop all services
echo 4. Build all images
echo 5. View logs
echo 6. Clean up (remove containers and images)
echo 7. Exit
echo.
set /p choice="Choose an option (1-7): "

if "%choice%"=="1" goto start_prod
if "%choice%"=="2" goto start_dev
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto build
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto cleanup
if "%choice%"=="7" goto exit
goto invalid

:start_prod
echo Starting all services in production mode...
docker-compose up -d
echo Services started! Access the frontend at http://localhost:3000
pause
goto menu

:start_dev
echo Starting all services in development mode...
docker-compose -f docker-compose.dev.yml up -d
echo Services started! Access the frontend at http://localhost:3000
pause
goto menu

:stop
echo Stopping all services...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo All services stopped.
pause
goto menu

:build
echo Building all Docker images...
docker-compose build
docker-compose -f docker-compose.dev.yml build
echo All images built successfully.
pause
goto menu

:logs
echo Showing logs for all services...
docker-compose logs -f
pause
goto menu

:cleanup
echo WARNING: This will remove all containers, images, and volumes!
set /p confirm="Are you sure? (y/N): "
if /i "%confirm%"=="y" (
    echo Cleaning up...
    docker-compose down -v --rmi all
    docker-compose -f docker-compose.dev.yml down -v --rmi all
    docker system prune -f
    echo Cleanup completed.
) else (
    echo Cleanup cancelled.
)
pause
goto menu

:invalid
echo Invalid option. Please choose 1-7.
pause
goto menu

:menu
cls
goto start

:exit
echo Goodbye!
pause
exit

:start
goto menu
