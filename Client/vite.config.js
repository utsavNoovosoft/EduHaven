import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { compression } from 'vite-plugin-compression2';

export default defineConfig(({ mode }) => {
  const isExtension = mode === "extension";

  return {
    base: isExtension ? "./" : "/",
    plugins: [
      react(),
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$/, /\.(gz)$/],
      }),
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
      }),
    ],
    resolve: {
      alias: { "@/": path.resolve(__dirname, "src") + "/" },
    },
    build: {
      outDir: isExtension ? "dist-extension" : "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "index.html"),
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            animations: ['framer-motion'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      },
      // Enable source maps for production debugging
      sourcemap: true,
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Minify CSS
      cssMinify: true,
      // Enable terser for better minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    // Performance optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion'],
    },
    // Dev server optimizations
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },
    // Preview server optimizations
    preview: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },
  };
});



// vite.config.js old
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   base: "./",
//   plugins: [react()],
//   resolve: {
//     alias: { "@/": path.resolve(__dirname, "src") + "/" },
//   },
//   build: {
//     outDir: "dist",
//     emptyOutDir: true,
//     rollupOptions: {
//       input: path.resolve(__dirname, "index.html"),
//     },
//   },
//   server: {
//     historyApiFallback: true,
//   },
// });
