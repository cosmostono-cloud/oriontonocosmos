import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, '.', '');
  
  // Tenta pegar a chave de API de várias fontes possíveis
  const apiKey = env.API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Injeta a chave de forma segura no código
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Evita crash por 'process is not defined'
      'process.env': {}
    }
  };
});