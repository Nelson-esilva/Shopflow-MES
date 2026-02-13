#!/bin/sh
set -e

cd /app

# Validação de variáveis de ambiente
: "${DB_NAME:?Variável DB_NAME não definida}"
: "${DB_USER:?Variável DB_USER não definida}"
: "${DB_PASSWORD:?Variável DB_PASSWORD não definida}"
: "${DB_HOST:?Variável DB_HOST não definida}"
: "${DB_PORT:?Variável DB_PORT não definida}"

# Espera o PostgreSQL ficar pronto
echo "Esperando o PostgreSQL em $DB_HOST:$DB_PORT..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 0.5
done
echo "PostgreSQL pronto!"

# Migrações do Django
echo "Executando migrações..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Executa o comando passado ao container (por exemplo, runserver)
exec "$@"