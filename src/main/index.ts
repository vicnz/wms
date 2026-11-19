import dotenv from 'dotenv'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { registerRoute } from '../lib/electron-router-dom'
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import fs from 'node:fs'

const envPath = app.isPackaged ? path.join(process.resourcesPath, '.env') : path.join(process.cwd(), '.env')
dotenv.config({ path: envPath });

let pocketbase: ChildProcess | undefined;

function createInitialSuperuser(binaryPath: string, dataDir: string): void {
  if (fs.existsSync(join(dataDir, 'data.db'))) return

  const email = process.env.POCKETBASE_SUPERUSER_EMAIL
  const password = process.env.POCKETBASE_SUPERUSER_PASSWORD

  if (!email || !password) {
    throw new Error(
      'POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD are required before initializing a new local PocketBase database.'
    )
  }

  const result = spawnSync(binaryPath, ['superuser', 'create', email, password, `--dir=${dataDir}`], {
    windowsHide: true,
    encoding: 'utf8'
  })

  if (result.error || result.status !== 0) {
    throw new Error(`Failed to create the initial PocketBase superuser: ${result.error?.message ?? result.stderr}`)
  }
}

async function startPocketBase(): Promise<void> {
  const isDev = !app.isPackaged;
  const binaryPath = isDev ? join(process.cwd(), 'database', 'pocketbase.exe') : join(process.resourcesPath, 'data', 'pocketbase.exe')
  const migrationDir = isDev ? join(process.cwd(), 'database', 'pb_migrations') : join(process.resourcesPath, 'data', 'pb_migrations')
  const dataDir = isDev ? join(process.cwd(), 'database', 'pb_data') : join(process.resourcesPath, 'data', 'pb_data')
  const configuredAddress = process.env.POCKETBASE_URL

  if (!configuredAddress) {
    throw new Error('POCKETBASE_URL is required.')
  }

  const pocketbaseUrl = configuredAddress.startsWith('http') ? configuredAddress : `http://${configuredAddress}`
  const pocketbaseAddress = new URL(pocketbaseUrl).host

  fs.mkdirSync(dataDir, { recursive: true });

  if (!isDev) {
    createInitialSuperuser(binaryPath, dataDir)
  }

  pocketbase = spawn(binaryPath, ['serve', `--http=${pocketbaseAddress}`, `--dir=${dataDir}`, `--migrationsDir=${migrationDir}`], {
    windowsHide: true,
    stdio: 'inherit'
  })

  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`${pocketbaseUrl}/api/health`)
      if (response.ok) return;
    } catch {
      //Pocketbase is still starting
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error("Pocketbase did not become ready in time");
}

function stopPocketBase(): void {
  if (pocketbase && !pocketbase.killed) {
    pocketbase.kill();
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.maximize();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // mainWindow.webContents.on('did-finish-load', async () => {
  //   const result = await mainWindow.webContents.executeJavaScript(`
  //   ({
  //     url: location.href,
  //     csp: document.querySelector(
  //       'meta[http-equiv="Content-Security-Policy"]'
  //     )?.content
  //   })
  // `);

  //   console.log('[CSP DEBUG]', result);
  // });
  // mainWindow.webContents.session.webRequest.onHeadersReceived(
  //   (details, callback) => {
  //     if (details.url.includes('localhost:5173')) {
  //       console.log('[RESPONSE HEADERS]', details.responseHeaders);
  //     }

  //     callback({ responseHeaders: details.responseHeaders });
  //   }
  // );

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  // }

  //initialize Electron Router
  registerRoute({
    id: 'main',
    browserWindow: mainWindow,
    devServerUrl: process.env['ELECTRON_RENDERER_URL'],
    htmlFile: path.join(__dirname, '../renderer/index.html'),
  })

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools({
      mode: 'detach',
      title: "Development Developer Tools"
    })
  }

}

const hasSingleInstanceLock = app.requestSingleInstanceLock()

if (hasSingleInstanceLock) {
  app.on('second-instance', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
} else {
  app.quit()
}


app.whenReady().then(async () => {
  if (!hasSingleInstanceLock) return

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.wms')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  await startPocketBase();
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//end pocketbase
app.on('before-quit', stopPocketBase);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


// function configureCSP() {
//   const { session } = require('electron')

//   session.defaultSession.webRequest.onHeadersReceived(
//     { urls: ['http://localhost:5173/*'] },
//     (details, callback) => {
//       const headers = { ...details.responseHeaders }

//       // Remove existing CSP headers to avoid conflicting policies
//       for (const key of Object.keys(headers)) {
//         if (key.toLowerCase() === 'content-security-policy') {
//           delete headers[key]
//         }
//       }

//       headers['Content-Security-Policy'] = [
//         [
//           "default-src 'self'",
//           "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
//           "style-src 'self' 'unsafe-inline'",
//           "img-src 'self' data: blob:",
//           "connect-src 'self' http://127.0.0.1:8090 http://localhost:8090 ws://localhost:5173"
//         ].join('; ')
//       ]

//       callback({ responseHeaders: headers })
//     }
//   )
// }