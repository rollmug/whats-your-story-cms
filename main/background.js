import { app, ipcMain, shell, dialog } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { lookpath } from 'lookpath';
import execShellCommand from './helpers/exec-cmd';
import Store from 'electron-store';
import fixPath from 'fix-path';
import launchMysql from './helpers/launch-mysql'
import launchDirectus from './helpers/launch-directus';
import forceUninstall from './helpers/force-uninstall';
import dockerAppStatus from './helpers/docker-status';
import stopDockerServices from './helpers/stop-services';
const settings = new Store();

fixPath();

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const checkInitAppSettings = async () => {
  const appSettings = await settings.get('appSettings');
  const userData = app.getPath('userData').replace(' (development)', '');
  if (typeof appSettings === 'object' && Object.keys(appSettings) > 0) {
    if (!appSettings.directory || appSettings.directory === '') {
      settings.set('appSettings.directory', userData);
    }
  } else {
    settings.set('appSettings', { directory: userData });
  }
}

(async () => {
  await app.whenReady();
  await checkInitAppSettings();

  const mainWindow = createWindow('main', {
    width: 1024,
    height: 800
  });

  var initialScript = (isProd ? 'index' : '');

  if (isProd) {
    await mainWindow.loadURL(`app://./${initialScript}.html`);
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/${initialScript}`);
    mainWindow.webContents.openDevTools();
  }

  let cmsWindow;
  const cmsWindowOpen = () => !cmsWindow?.isDestroyed() && cmsWindow?.isFocusable();

  ipcMain.on('launch-cms', async (event, arg) => {
    if (cmsWindowOpen()) {
      cmsWindow.focus();
    } else {
      cmsWindow = createWindow('cms', {
        width: 1024,
        height: 800
      });
      const appSettings = await settings.get('appSettings');
      await cmsWindow.loadURL(`http://localhost:${appSettings.port}`);
    }

    event.sender.send('cms-launched', true);
  });

  ipcMain.on('select-dirs', async (event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    event.sender.send('select-dirs-result', result.filePaths);
  });

  ipcMain.handle('docker-compose-down', async (event, data) => {
    if (cmsWindowOpen()) {
      cmsWindow.close();
    }

    const results = await stopDockerServices();
    event.sender.send('services-stopped', results);
    return results;
  });

  ipcMain.handle('nuke-app', async (event, createUser) => {
    if (cmsWindowOpen()) {
      cmsWindow.close();
    }

    const stop = await stopDockerServices();
    event.sender.send('app-stopped', stop);
    const remove = await forceUninstall();
    settings.set('appSettings.installed', false);
    settings.set('appSettings.dbInitialized', false);
    event.sender.send('app-nuked', remove);
    return remove;
  });
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('open-website', async (event, arg) => {
  shell.openExternal(arg);
});

ipcMain.on('docker-check', async (event, arg) => {
  let dockerPath = await lookpath('docker');
  const info = {};

  if (!dockerPath) {
    info.msg = `Docker application not found. Is it installed?`;
    info.alert = 'error';
  } else {
    const dockerInfo = await execShellCommand("docker info --format '{{json .}}'");
    const docker = JSON.parse(dockerInfo);
    info.docker = docker;

    if (typeof docker.ServerErrors === 'object' && docker.ServerErrors.length > 0) {
      info.msg = `It looks like Docker is not running: ${info.docker.ServerErrors[0]}`;
      info.alert = 'error';
    } else {
      info.msg = `Docker is installed and running.`;
      info.alert = 'success';
    }
  }

  event.sender.send('docker-result', info);
});

ipcMain.handle('update-settings', async (event, data) => {
  settings.set('appSettings', data);
  event.sender.send('initialized', { initialized: true });
  const appSettings = await settings.get('appSettings');
  return appSettings;
});

ipcMain.handle('get-settings', async (event, key) => {
  //can use dot notation to get nested: appSettings.email
  return settings.get(key);
});

ipcMain.handle('init-mysql', async (event, key) => {
  const results = await launchMysql();
  event.sender.send('mysql-launch', results);
  return results;
});

ipcMain.handle('init-directus', async (event, createUser) => {
  const results = await launchDirectus(createUser); // createUser is true or false, whether it should create the initial user
  event.sender.send('directus-launch', results);
  return results;
});

ipcMain.handle('db-initialized', async (event, value) => {
  //'value' can be set either true or false as needed
  settings.set('appSettings.dbInitialized', value); //so we don't overwrite the db creds once it's already been created
  const appSettings = await settings.get('appSettings');
  return appSettings;
});

// set a flag so we know it's been installed w/o errors
ipcMain.handle('install-success', async (event, flag) => {
  settings.set('appSettings.installed', true);
  const appSettings = await settings.get('appSettings');
  return appSettings;
});

ipcMain.handle('install-failure', async (event, flag) => {
  settings.set('appSettings.installed', false);
  const appSettings = await settings.get('appSettings');
  return appSettings;
});

ipcMain.handle('force-uninstall', async (event, createUser) => {
  const results = await forceUninstall();
  event.sender.send('app-uninstalled', results);
  return results;
});

ipcMain.handle('fetch-app-status', async (event, flag) => {
  const results = await dockerAppStatus();
  event.sender.send('return-app-status', results);
  return results;
});


/**
 * Auto Updater
 * https://www.npmjs.com/package/electron-updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */