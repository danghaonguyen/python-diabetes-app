import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // loadEnv đọc cả biến không có tiền tố VITE_ (mặc định Vite chỉ expose VITE_* cho client).
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: env.HOST || '127.0.0.1',
      port: Number(env.PORT) || 3000,
      proxy: {
        // Tự động chuyển tất cả request /api sang Backend Flask 127.0.0.1:5000 mà không bao giờ bị lỗi CORS
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});