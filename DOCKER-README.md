# Microservice Architecture with Docker

Este projeto contém uma arquitetura de microsserviços com Docker, incluindo:
- **Book Service** (NestJS) - Porta 3001
- **Reservation Service** (NestJS) - Porta 3002
- **Frontend** (Next.js) - Porta 3000
- **MongoDB** - Porta 27017

## 🚀 Como usar

### Opção 1: Script automatizado (Recomendado)
```bash
# Execute o script interativo
./docker-manager.bat
```

### Opção 2: Comandos manuais

#### Produção
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

#### Desenvolvimento (com hot reload)
```bash
# Iniciar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços
docker-compose -f docker-compose.dev.yml down
```

## 🔧 Configuração

### Variáveis de Ambiente

#### Book Service
- `PORT=3001`
- `MONGODB_URI=mongodb://mongodb:27017/book_service_db`

#### Reservation Service
- `PORT=3002`
- `MONGODB_URI=mongodb://mongodb:27017/reservation_service_db`

#### Frontend
- `NEXT_PUBLIC_BOOK_SERVICE_URL=http://localhost:3001/books`
- `NEXT_PUBLIC_RESERVATION_SERVICE_URL=http://localhost:3002/reservations`

## 📊 Health Checks

Todos os serviços incluem health checks:
- Book Service: `http://localhost:3001/health`
- Reservation Service: `http://localhost:3002/health`
- Frontend: `http://localhost:3000`

## 🐛 Troubleshooting

### Erro de rede (Network Error)
1. Verifique se todos os containers estão rodando:
   ```bash
   docker ps
   ```

2. Verifique os logs dos serviços:
   ```bash
   docker-compose logs book-service
   docker-compose logs reservation-service
   ```

3. Teste os health checks:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   ```

### Erro de porta em uso
```bash
# Parar todos os serviços
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Verificar processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002
```

### Reconstruir imagens
```bash
# Reconstruir todas as imagens
docker-compose build --no-cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Limpar tudo
```bash
# Remover containers, imagens e volumes
docker-compose down -v --rmi all
docker-compose -f docker-compose.dev.yml down -v --rmi all
docker system prune -f
```

## 📂 Estrutura dos Arquivos Docker

```
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento
├── docker-manager.bat          # Script de gerenciamento
└── apps/
    ├── book-service/
    │   ├── Dockerfile          # Produção
    │   ├── Dockerfile.dev      # Desenvolvimento
    │   └── .dockerignore
    ├── reservation-service/
    │   ├── Dockerfile
    │   ├── Dockerfile.dev
    │   └── .dockerignore
    └── frontend/
        ├── Dockerfile
        ├── Dockerfile.dev
        └── .dockerignore
```

## 🌐 URLs dos Serviços

- **Frontend**: http://localhost:3000
- **Book Service**: http://localhost:3001
- **Reservation Service**: http://localhost:3002
- **MongoDB**: mongodb://localhost:27017

## 📈 Monitoramento

Para monitorar os serviços:
```bash
# Status dos containers
docker ps

# Uso de recursos
docker stats

# Logs em tempo real
docker-compose logs -f
```
