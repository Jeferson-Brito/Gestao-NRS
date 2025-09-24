# 🚀 Guia de Hospedagem - Gestão NRS

## Opções de Hospedagem Recomendadas

### 1. **Heroku (Mais Fácil)**
- **Frontend**: Netlify ou Vercel
- **Backend**: Heroku
- **Banco**: Heroku Postgres (gratuito)

### 2. **AWS (Mais Profissional)**
- **Frontend**: S3 + CloudFront
- **Backend**: EC2
- **Banco**: RDS PostgreSQL

### 3. **DigitalOcean (Intermediário)**
- **Frontend**: Netlify
- **Backend**: Droplet
- **Banco**: Managed PostgreSQL

## Passo a Passo - Heroku (Recomendado)

### 1. Preparar o Projeto

```bash
# No diretório server
npm install pg
npm install dotenv
```

### 2. Criar arquivo .env
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=gestao_nrs
DB_PASSWORD=sua_senha
DB_PORT=5432
NODE_ENV=development
```

### 3. Criar Procfile
```
web: node server-postgres.js
```

### 4. Deploy no Heroku

1. **Instalar Heroku CLI**
2. **Login**: `heroku login`
3. **Criar app**: `heroku create gestao-nrs-api`
4. **Adicionar PostgreSQL**: `heroku addons:create heroku-postgresql:hobby-dev`
5. **Deploy**: `git push heroku main`

### 5. Configurar Frontend

1. **Build**: `npm run build`
2. **Deploy no Netlify**: Arrastar pasta build
3. **Configurar variáveis de ambiente**:
   - `REACT_APP_API_URL=https://gestao-nrs-api.herokuapp.com`

## Configuração para Produção

### Variáveis de Ambiente (Heroku)
```bash
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=seu_host_heroku
heroku config:set DB_PASSWORD=sua_senha_heroku
```

### Frontend (Netlify)
```env
REACT_APP_API_URL=https://seu-app.herokuapp.com
```

## Monitoramento

### Heroku
- **Logs**: `heroku logs --tail`
- **Status**: Dashboard do Heroku

### Netlify
- **Deploy**: Automático via Git
- **Logs**: Dashboard do Netlify

## Custos Estimados

### Heroku (Gratuito)
- **Backend**: $0 (hobby-dev)
- **Banco**: $0 (hobby-dev)
- **Frontend**: $0 (Netlify)

### Heroku (Pago)
- **Backend**: $7/mês
- **Banco**: $9/mês
- **Frontend**: $0 (Netlify)

## Backup e Segurança

### Backup Automático
- Heroku faz backup automático do banco
- Netlify mantém histórico de deploys

### Segurança
- HTTPS automático
- Variáveis de ambiente seguras
- CORS configurado

## Suporte

- **Heroku**: Documentação oficial
- **Netlify**: Documentação oficial
- **PostgreSQL**: Documentação oficial
