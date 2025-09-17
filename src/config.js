// Configuração de ambiente
const config = {
  development: {
    API_URL: 'http://localhost:3001'
  },
  production: {
    API_URL: 'https://gestao-n6er95l2e-jeferson-britos-projects.vercel.app/api'
  }
};

const environment = 'development'; // Usar desenvolvimento para conectar ao SQLite local
export default config[environment];
