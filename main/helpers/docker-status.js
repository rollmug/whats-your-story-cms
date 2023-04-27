import execShellCommand from './exec-cmd';
import fs from 'fs-extra'
import Store from 'electron-store';
import upath from 'upath';
import fixPath from 'fix-path';
const settings = new Store();

const dockerAppStatus = async () => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    const returnData = {};
    
    fixPath();

    const dockerExists = await fs.pathExists(dockerFile);

    if (dockerExists === true) {
        try {
            const results = await execShellCommand(`docker-compose -f ${dockerFile} ps -a --format 'json'`);

            if(results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                const data = JSON.parse(results);

                if(typeof data === 'object' && data.length > 0) {
                    const services = {
                        directus: data.find(({ Name }) => Name === 'directus'),
                        mysql: data.find(({ Name }) => Name === 'mysql')
                    };

                    returnData.services = services;
                } else {
                    returnData.error = "No services running.";
                }
            }
        } catch(e) {
            returnData.error = e.message;
        }
    } else {
        returnData.error = `Cannot locate needed application files. Did they get moved or deleted from ${appDir} ?`
    }

    return returnData;
};

export default dockerAppStatus;