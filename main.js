const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const join = require('path').join;


const openAboutWindow = require('about-window').default;

let mainWindow;

const nativeImage = require('electron').nativeImage;
var image = nativeImage.createFromPath(join(__dirname, 'img/icon3D.png'));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: image
  });
  mainWindow.title = 'Tibidibidibada ' + app.getVersion();
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Help',
      submenu: [
        {
          label: 'About This App',
          click: () =>
            openAboutWindow({
              icon_path: join(__dirname, 'img/icon3D.png'),
              copyright: 'Copyright (c) 2022 Mehdi TAHAN',
              package_json_dir: __dirname,
              open_devtools: process.env.NODE_ENV !== 'production',
            }),
        },
        {
          role: 'quit',
        },
      ],
    },
  ]);
  app.applicationMenu = menu;
}

app.on('ready', () => {
  createWindow();

  createMenu();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});