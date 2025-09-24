// Configuração de ambiente
const config = {
  development: {
    API_URL: 'http://localhost:3001'
  },
  production: {
    API_URL: 'https://gestao-kupsaadbe-jeferson-britos-projects.vercel.app/api'
  }
};

const environment = 'production'; // Usar produção para conectar ao Vercel
export default config[environment];
