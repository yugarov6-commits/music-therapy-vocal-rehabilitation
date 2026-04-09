const { contextBridge } = require('electron');

// Безопасный мост между Electron и веб-страницей
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.env.npm_package_version || '1.0.0',
});
