import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  // process.cwd() pode falhar em alguns ambientes serverless, então usamos '.'
  const env = loadEnv(mode, '.', '');
  
  // Tenta capturar a chave de várias formas possíveis
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  console.log(`Build mode: ${mode}. API Key detected: ${apiKey ? 'Yes' : 'No'}`);

  return {
    plugins: [react()],
    define: {
      // Substituição direta e segura
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Fallback de segurança para o objeto process.env
      'process.env': JSON.stringify({
         API_KEY: apiKey,
         NODE_ENV: mode
      })
    }
  };
});