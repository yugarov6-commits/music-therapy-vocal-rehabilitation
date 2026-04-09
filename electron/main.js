const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    title: 'Музовокальная реабилитация',
    backgroundColor: '#0d0c18',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // разрешает загрузку CDN-картинок и шрифтов
    },
    // Убираем стандартное меню Windows
    autoHideMenuBar: true,
    frame: true,
    icon: path.join(__dirname, '../public/favicon.svg'),
  });

  if (isDev) {
    // В режиме разработки — подключаемся к Vite dev server
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // В продакшене — загружаем собранный dist
    const indexPath = path.join(__dirname, '../dist/index.html');
    win.loadURL(pathToFileURL(indexPath).href);
  }

  // Внешние ссылки открываем в браузере, не в Electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Убираем стандартное меню полностью
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
