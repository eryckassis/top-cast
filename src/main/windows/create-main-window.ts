import { app, BrowserWindow, Menu, session } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_NAME } from '../../shared/constants/app.js';
import { configureNativeAppFeatures } from '../services/native-app-features.js';
import { configureScreenCapture } from '../services/screen-capture.js';
import { configureProcessAudioCapture } from '../services/process-audio-capture.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createMainWindow(): BrowserWindow {
  Menu.setApplicationMenu(null);

  const allowedPermissions = [
    'display-capture',
    'media',
    'clipboard-read',
    'clipboard-write',
    'clipboard-sanitized-write',
    'fullscreen',
    'automatic-fullscreen',
  ];

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (allowedPermissions.includes(permission)) {
      callback(true);
      return;
    }

    callback(false);
  });

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return allowedPermissions.includes(permission);
  });

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: '#10131a',
    title: APP_NAME,
    autoHideMenuBar: true,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.on('enter-html-full-screen', () => {
    if (!mainWindow.isDestroyed() && !mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(true);
    }
  });

  mainWindow.webContents.on('leave-html-full-screen', () => {
    if (!mainWindow.isDestroyed() && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  configureNativeAppFeatures(mainWindow);
  configureScreenCapture(mainWindow);
  configureProcessAudioCapture(mainWindow);

  if (app.isPackaged) {
    void mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
  } else {
    void mainWindow.loadURL('http://localhost:4173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  return mainWindow;
}