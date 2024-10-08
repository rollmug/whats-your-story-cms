import execShellCommand from "./exec-cmd";
import fixPath from 'fix-path';
import commandExists from "command-exists";
import { lookpath } from 'lookpath';
import fs from 'fs-extra'
import upath from 'upath';
import os from 'os';
import getSettingsFromCache from "./cache-settings";
// import jq from 'node-jq';

const platform = os.platform();

const dockerInfo = async () => {
    const dockerInfo = await execShellCommand('docker info --format "{{json .}}"');
    return JSON.parse(dockerInfo);
}

const dockerConfig = async () => {
    let docker = {
        installed: false,
        running: false
    };

    try {
        if(platform !== 'win32') fixPath();

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
    console.log('loading docker app status...');
    const appSettings = await getSettingsFromCache();
    const dirFullPath = appSettings.directory;
    const appDir = upath.join(dirFullPath, 'directus-cms');
    const dockerFile = upath.join(appDir, 'docker-compose.yml');
    let returnData = {};

    console.log('dockerFile:', dockerFile);

    const dockerExists = await fs.pathExists(dockerFile);

    if (dockerExists === true) {
        try {
            console.log(`Checking status of docker services... ${dockerFile}`);
            const results = await execShellCommand(`docker compose -f "${dockerFile}" ps -a`);
            
            if(results.includes('Cannot connect to the Docker daemon')) {
                returnData.error = "Docker is not running.";
            } else {
                //const data = JSON.parse(results); // 2024-08-30 this will now throw an error with the latest docker compose :(

                const mysqlStatus = await execShellCommand("docker inspect --type=container mysql_wys -f '{{ .State.Status }}'");
                const directusStatus = await execShellCommand("docker inspect --type=container directus_wys -f '{{ .State.Status }}'");

                const data = [
                    { Name: 'mysql_wys', State: mysqlStatus.trim() },
                    { Name: 'directus_wys', State: directusStatus.trim() }
                ];

                if(typeof data === 'object' && data.length > 0) {
                    const services = {
                        directus: data.find(({ Name }) => Name === 'directus_wys'),
                        mysql: data.find(({ Name }) => Name === 'mysql_wys')
                    };

                    returnData.services = services;
                } else {
                    returnData.error = "No services running.";
                }
            }
        } catch(e) {
            // console.log(e.message);
            returnData.error = e.message;
        }
    } else {
        returnData.error = `Cannot locate needed application files. Did they get moved or deleted from '${appDir}'?`
    }

    return returnData;
}

export { dockerInfo, dockerConfig, dockerAppStatus };