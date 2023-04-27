import waitOn from 'wait-on';
import execShellCommand from './exec-cmd';
import fs from 'fs-extra'
import Store from 'electron-store';
import upath from 'upath';
const settings = new Store();

const stopDockerServices = async () => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    const returnData = {};

    const dockerExists = await fs.pathExists(dockerFile);

    if (dockerExists === true) {
        try {
            const results = await execShellCommand(`docker-compose -f '${dockerFile}' down`);

            //console.log(results)

            if(results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                returnData.success = 1;
            }
        } catch(e) {
            //some other error
            returnData.error = e.message;
        }
    } else {
        //error - no docker file found
        returnData.error = `Cannot locate the needed file(s) at '${dockerFile}'`;
    }

    return returnData;
}

export default stopDockerServices;