FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    netcat-openbsd \
    libpq-dev \
    dos2unix \
    curl \
    gcc \
    git \
    vim \
    nano \
    htop \
    net-tools \
    iputils-ping \
    wget \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/requirements.txt /app
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && dos2unix /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]