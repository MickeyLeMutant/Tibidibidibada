const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const join = require('path').join;


const openAboutWindow = require('about-window').default;

const openLibrary = () => {
  // open dialog
  dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
    .then(result => {
      if (!result.canceled) {
       const directoryPath = result.filePaths;

        //mainWindow.webContents.send('workspace',{path: directoryPath});
        // load config
        const fs = require('fs');
        const cfgPath = directoryPath + `/tibi.json`
        if (fs.existsSync(cfgPath)) {
          fs.readFile(cfgPath, (err, data) => {
            if (err) throw err;
            let cfg = JSON.parse(data);
            mainWindow.webContents.send('filters_init',{cfg: cfg});
          });
        } else {
          console.log('does not')
          // version directory direct
            mainWindow.webContents.send('direct_directory',{directoryPath: directoryPath});
        }

        /*let student = { 
            name: 'Mike',
            age: 23, 
            gender: 'Male',
            department: 'English',
            car: 'Honda' 
        };*/

        //fs.writeFileSync(path.resolve(__dirname, 'student.json'), JSON.stringify(student));
        // load filters in UI
      }
    }).catch(err => {
      console.log(err)
    })
}

let mainWindow;

// #region UI init
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
  //mainWindow.webContents.openDevTools({ mode: 'detach' })
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
  const menu = Menu.buildFromTemplate([{
    label: 'File',
    submenu: [
      {
        label: 'Open Library',
        click: () =>
          openLibrary(),
      },
      {
        label: 'Import in library',
        click: () =>
          openAboutWindow({
            icon_path: join(__dirname, 'img/icon3D.png'),
            copyright: 'Copyright (c) 2022 Mehdi TAHAN',
            package_json_dir: __dirname,
            open_devtools: process.env.NODE_ENV !== 'production',
          }),
      },
    ],
  },
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

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// #endregion

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// #region auto update
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// #endregion