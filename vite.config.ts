import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga variables del archivo .env o del entorno de Vercel
  // El tercer argumento '' le dice que cargue TODAS las variables, no solo las que empiezan por VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // ESTO ES LO IMPORTANTE:
      // Vite buscará el texto "process.env.API_KEY" en tu código y lo reemplazará
      // por el valor real de tu clave VITE_API_KEY.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || '')
    }
  };
});