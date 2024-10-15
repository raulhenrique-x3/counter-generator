#!/bin/bash

# Derrubar os containers atuais
echo "Derrubando containers..."
docker-compose down

# Rodar os containers novamente
echo "Subindo containers novamente..."
docker-compose up --build -d

# Exibir o status dos containers
docker-compose ps