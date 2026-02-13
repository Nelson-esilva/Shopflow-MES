#!/bin/bash

echo "Removendo todos os containers..."
docker ps -aq | xargs -r docker rm -f

echo "Removendo todos os volumes..."
docker volume ls -q | xargs -r docker volume rm

echo "✅ Docker limpo."
