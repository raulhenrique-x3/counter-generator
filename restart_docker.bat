@echo off

echo Derrubando containers...
docker-compose down

echo Subindo containers novamente...
docker-compose up --build -d

echo Exibindo status dos containers...
docker-compose ps

pause