const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  root: "src/",
  publicDir: "../public/",
  base: "./",
  optimizeDeps: {
    // Avoid prebundling Three.js which can cause Outdated Optimize Dep loops on Windows
    exclude: [
      "three",
      "three/examples/jsm/controls/OrbitControls",
      "three/examples/jsm/loaders/FBXLoader",
      "three/examples/jsm/loaders/GLTFLoader",
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
    fs: {
      // Allow serving model assets from project root `model/` while root is `src/`
      allow: [".."],
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
};
