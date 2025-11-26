import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do sistema (.env ou Vercel UI)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Captura a chave, aceitando VITE_API_KEY ou API_KEY
  const apiKey = env.API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Define o objeto process.env inteiro para evitar conflitos de "process not defined"
      // e garante que a API_KEY esteja dentro dele.
      'process.env': JSON.stringify({
        API_KEY: apiKey,
        NODE_ENV: mode
      })
    }
  };
});