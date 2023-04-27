import execShellCommand from './exec-cmd';
import Store from 'electron-store';
import upath from 'upath';
import fs from 'fs-extra'
import fixPath from 'fix-path';
const settings = new Store();

/**
 * 
 * - stop any running docker compose images
 * - update the config settings
 * - delete the app directory
 */

const removeAppDir = async () => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const res = {};

    try {
        await fs.remove(appDir);
        res.success = 1;
    } catch (err) {
        console.error(err)
        res.error = err;
    }

    return res;
}

const forceUninstall = async () => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    const dockerExists = await fs.pathExists(dockerFile);
    const returnData = {};

    fixPath();

    settings.set('appSettings.installed', false);
    settings.set('appSettings.dbInitialized', false);

    if (dockerExists === true) {
        try {
            const cmd = `docker-compose -f ${dockerFile} down`;
            const results = await execShellCommand(cmd);
            await removeAppDir();

            if (results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                returnData.success = 1;
            }
        } catch (e) {
            returnData.error = e.message;
        }
    } else {
        //can't find the docker-compose file, so just try to remove the appDir
        await removeAppDir();
        returnData.success = 1
    }

    return returnData;
}

export default forceUninstall;