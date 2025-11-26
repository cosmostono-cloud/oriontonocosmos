import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Garante que seja uma string, mesmo que vazia, para não quebrar o app na inicialização
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Previne erro 'process is not defined' no navegador
      'process.env': {}
    }
  };
});