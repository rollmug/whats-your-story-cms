import electron from 'electron';
const ipcRenderer = electron.ipcRenderer || false;

const getSettingsFromCache = async () => {
    const appSettings = await ipcRenderer.invoke('get-settings', 'appSettings');
    return appSettings;
}

export default getSettingsFromCache;