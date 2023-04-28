import waitOn from 'wait-on';
import execShellCommand from './exec-cmd';
import fs from 'fs-extra'
import Store from 'electron-store';
import upath from 'upath';
const settings = new Store();

const launchMysql = async () => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    const returnData = {};

    const opts = {
        resources: [
            'tcp:127.0.0.1:3306'
        ],
        delay: 1000,
        interval: 100,
        timeout: 30000,
        tcpTimeout: 30000
    }

    const dockerExists = await fs.pathExists(dockerFile);

    if (dockerExists === true) {
        //console.log('1. Docker compose file exists.');

        try {
            const results = await execShellCommand(`docker-compose -f "${dockerFile}" up -d mysql`);

            // console.log('2. Docker compose results:');
            // console.log(results);

            if(results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                //should be good. now wait until it responds, then return success
                try {
                    await waitOn(opts);
                    returnData.success = 1;
                } catch(err) {
                    returnData.error = err;
                }
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

export default launchMysql;