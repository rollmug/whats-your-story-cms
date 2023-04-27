import getSettingsFromCache from "./cache-settings";
import upath from 'upath';
import fs from 'fs-extra';
import fixPath from 'fix-path';

const checkAppInstalled = async () => {
    const appSettings = await getSettingsFromCache();

    console.log('appSettings:');
    console.log(appSettings);

    fixPath();

    if (typeof appSettings === 'object' && Object.keys(appSettings).length > 0) {
        const dirFullPath = appSettings.directory;
        const appDir = upath.join(dirFullPath, 'directus-cms');
        const envFile = upath.join(appDir, '.env');
        const dockerFile = upath.join(appDir, 'docker-compose.yml');

        const envExists = await fs.pathExists(envFile);
        const dockerExists = await fs.pathExists(dockerFile);

        console.log('envFile:');
        console.log(envFile);

        console.log('dockerFile:');
        console.log(dockerFile);

        if (appSettings.installed === true && envExists && dockerExists) {
            return true;
        }
    }

    return false;
}

export { checkAppInstalled };