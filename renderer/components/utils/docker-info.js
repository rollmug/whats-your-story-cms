import execShellCommand from "./exec-cmd";
import fixPath from 'fix-path';
import commandExists from "command-exists";
import fs from 'fs-extra'
import upath from 'upath';
import getSettingsFromCache from "./cache-settings";

const dockerInfo = async () => {
    const dockerInfo = await execShellCommand("docker info --format '{{json .}}'");
    return JSON.parse(dockerInfo);
}

const dockerConfig = async () => {
    let docker = {
        installed: false,
        running: false
    };

    try {
        fixPath();
        const dockerExists = await commandExists('docker');

        if (dockerExists) {
            const dockerData = await dockerInfo();
    
            docker.installed = true;
            docker.data = dockerData;
    
            if (typeof dockerData.ServerErrors === 'object' && dockerData.ServerErrors.length > 0) {
                docker.running = false;
            } else {
                docker.running = true;
            }
        }
    } catch(e) {
        docker.error = e;
    }

    return docker;
}

const dockerAppStatus = async () => {
    const appSettings = await getSettingsFromCache();
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    let returnData = {};

    const dockerExists = await fs.pathExists(dockerFile);

    if (dockerExists === true) {
        try {
            const results = await execShellCommand(`docker-compose -f '${dockerFile}' ps -a --format 'json'`);

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
        returnData.error = `Cannot locate needed application files. Did they get moved or deleted from '${appDir}'?`
    }

    return returnData;
}

export { dockerInfo, dockerConfig, dockerAppStatus };