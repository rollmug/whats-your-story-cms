import execShellCommand from './exec-cmd';
import Store from 'electron-store';
import upath from 'upath';
import fs from 'fs-extra'
const settings = new Store();
import axios from 'axios';
import fixPath from 'fix-path';

const directusUserExists = async (userEmail) => {
    const appSettings = await settings.get('appSettings');
    const url = `http://localhost:${appSettings.port}/users`;

    fixPath();

    try {
        const response = await axios.get(url, {
            headers: { "Authorization": `Bearer ${appSettings.directusAPIToken}` }
        });

        const users = response.data.data;

        if (typeof users === 'object' && users.length > 0) {
            const result = users.find(({ email }) => email === userEmail);
            if (result) return true; //result is an object with user's data. we might be able to use this, ie, result.id to make it easier later?
        } else {
            return false;
        }
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return false;
    }

    return false;
}

const createDirectusUser = async (userData) => {
    const appSettings = await settings.get('appSettings');
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    const returnData = {};

    const dockerExists = await fs.pathExists(dockerFile);
    const userExists = await directusUserExists(userData.email);

    if (dockerExists === true) {
        if (userExists) {
            //update their password, in case they changed it
            const cmd = `docker-compose -f ${dockerFile} exec directus npx directus users passwd --email '${userData.email}' --password '${userData.pass}'`;
            const results = await execShellCommand(cmd);

            if (results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                console.log('Password updated for ' + userData.email);
                returnData.success = 1;
            }
        } else {
            try {
                const roleID = 'e9e725cd-25a0-4c96-8677-1a0dc4793150';
                const cmd = `docker-compose -f ${dockerFile} exec directus npx directus users create --email '${userData.email}' --password '${userData.pass}' --role '${roleID}'`;
                const results = await execShellCommand(cmd);

                if (results.includes('Cannot connect to the Docker daemon')) {
                    returnData.error = "Docker is not running.";
                } else {
                    returnData.success = 1;
                }
            } catch (e) {
                returnData.error = e.message;
            }
        }
    } else {
        returnData.error = `Cannot locate the needed file(s) at ${dockerFile}`;
    }

    return returnData;
};

export default createDirectusUser;