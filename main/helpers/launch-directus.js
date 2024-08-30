import waitOn from 'wait-on';
import execShellCommand from './exec-cmd';
import fs from 'fs-extra'
import Store from 'electron-store';
import upath from 'upath';
import createDirectusUser from './create-directus-user';
const settings = new Store();

const launchDirectus = async (createUser) => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    const returnData = {};

    const opts = {
        resources: [
            `http://localhost:${appSettings.port}`
        ],
        delay: 1000,
        interval: 800,
        timeout: 90000,
        tcpTimeout: 90000
    }

    const dockerExists = await fs.pathExists(dockerFile);

    if (dockerExists === true) {
        //console.log('3. Docker compose file exists.');

        try {
            const results = await execShellCommand(`docker compose -f "${dockerFile}" up -d`);

            // console.log('4. Docker compose up results:');
            // console.log(results);

            if(results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                //shoud be good. now wait until it responds, then return success
                try {
                    await waitOn(opts);

                    if(createUser) {
                        const userRes = await createDirectusUser({
                            email: appSettings.email,
                            pass: appSettings.password
                        });
                        // console.log('5. User create:');
                        // console.log(userRes);

                        if(userRes.success) {
                            returnData.success = 1;
                        } else {
                            returnData.error = userRes.error;
                        }
                    } else {
                        returnData.success = 1;
                    }
                } catch(err) {
                    returnData.error = err.message;
                }
            }
        } catch(e) {
            //some other error
            returnData.error = e.message;
        }
    } else {
        returnData.error = `Cannot locate the needed file(s) at ${dockerFile}`;
    }

    return returnData;
}

export default launchDirectus;