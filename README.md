# 🚀 Microservices Project

```
Arthur Vinícius de Oliveira Semensati -231051492
Daniel Barrionuevo Gomes - 220144962
Natanael Figueredo Balbo - 220141852
Rodrigo Shodi Sumioshi - 220141912
Vinicius Luiz Santa Rosa - 240421212
Pablo Vinicius Formagio Lima - 19933212
```

Sistema de microserviços com gerenciamento de livros e reservas.

## 📁 Estrutura do Projeto

```
micro-service/
├── apps/
│   ├── book-service/      # API de Livros (NestJS) - Porta 3001
│   ├── reservation-service/ # API de Reservas (NestJS) - Porta 3002
│   └── frontend/          # Interface Web (Next.js) - Porta 3000
├── packages/              # Pacotes compartilhados (se houver)
├── package.json           # Scripts do projeto raiz
└── start-all.bat         # Script para iniciar todos os serviços
```

## 🏃‍♂️ Como Iniciar o Projeto

### Opção 1: Iniciador Automático (Recomendado)
Execute o script que inicia todos os serviços automaticamente:
```bash
.\start-all.bat
```

### Opção 2: Manualmente em Terminais Separados

1. **Book Service:**
```bash
cd apps/book-service
npm run start:dev
```

2. **Reservation Service:**
```bash
cd apps/reservation-service  
npm run start:dev
```

3. **Frontend:**
```bash
cd apps/frontend
npm run dev
```

## 🌐 URLs dos Serviços

- **Frontend:** http://localhost:3000
- **Book API:** http://localhost:3001
- **Reservation API:** http://localhost:3002

## 📋 Scripts Disponíveis

### No diretório raiz:
- `npm run install:all` - Instala dependências de todos os serviços
- `npm run dev:book` - Inicia apenas o book-service em modo dev
- `npm run dev:reservation` - Inicia apenas o reservation-service em modo dev  
- `npm run dev:frontend` - Inicia apenas o frontend em modo dev
- `npm run build:all` - Faz build de todos os serviços
- `npm run test:all` - Executa testes de todos os serviços

### Em cada serviço individual:
- `npm run start:dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm run start` - Inicia em modo produção
- `npm test` - Executa testes

## 🛠️ Tecnologias Utilizadas

- **Backend:** NestJS, TypeScript, MongoDB (via Mongoose)
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Zustand
- **Validação:** Zod
- **HTTP Client:** Axios

## ⚙️ Configuração

### Variáveis de Ambiente (opcionais)

Você pode criar arquivos `.env` em cada serviço para configurar:

**Book Service (.env):**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/bookservice
```

**Reservation Service (.env):**
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/reservationservice
BOOK_SERVICE_URL=http://localhost:3001
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_BOOK_API_URL=http://localhost:3001
NEXT_PUBLIC_RESERVATION_API_URL=http://localhost:3002
```

## 🗄️ Banco de Dados

O projeto usa MongoDB. Certifique-se de ter o MongoDB rodando localmente na porta padrão 27017, ou configure as URLs de conexão nas variáveis de ambiente.

## 🐛 Solução de Problemas

1. **Portas ocupadas:** Verifique se as portas 3000, 3001 e 3002 estão livres
2. **Dependências:** Execute `npm run install:all` para garantir que tudo está instalado
3. **MongoDB:** Verifique se o MongoDB está rodando
4. **Versão do Node:** Recomendado Node.js 20.11+ (você tem 20.3.0, pode haver alguns warnings)

## 🔄 Desenvolvimento

Para desenvolvimento, recomenda-se usar 3 terminais separados para ver os logs de cada serviço individualmente, ou usar o script `start-all.bat` que abre automaticamente 3 janelas de terminal.

---
