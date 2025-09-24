# 🚀 Guia de Deploy - Gestão NRS

## 📋 Pré-requisitos
- Conta no [Vercel](https://vercel.com) (gratuito)
- Conta no [Netlify](https://netlify.com) (gratuito)
- Projeto Firebase configurado

## 🔧 Deploy do Backend (Vercel)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer login no Vercel
```bash
vercel login
```

### 3. Deploy do Backend
```bash
cd server
vercel --prod
```

### 4. Configurar Variáveis de Ambiente no Vercel
No painel do Vercel, adicione:
- `FIREBASE_PROJECT_ID`: gestao-nrs
- `FIREBASE_PRIVATE_KEY`: (sua chave privada do Firebase)
- `FIREBASE_CLIENT_EMAIL`: (seu email do Firebase)

## 🌐 Deploy do Frontend (Netlify)

### 1. Build do Projeto
```bash
npm run build
```

### 2. Deploy Manual
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Add new site" > "Deploy manually"
3. Arraste a pasta `build` para a área de deploy
4. Configure o nome do site (ex: gestao-nrs)

### 3. Deploy Automático (Recomendado)
1. Conecte seu repositório GitHub ao Netlify
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables: `NODE_ENV=production`

## 🔗 URLs Finais
- **Frontend**: https://seu-site.netlify.app
- **Backend**: https://gestao-nrs-backend.vercel.app
- **Firebase**: https://console.firebase.google.com

## ✅ Verificação
1. Acesse o frontend
2. Teste o login
3. Gere uma escala
4. Exporte um PDF

## 🔄 Atualizações
- **Frontend**: Push para GitHub = Deploy automático
- **Backend**: `vercel --prod` = Deploy manual
- **Dados**: Firebase = Sincronização automática




