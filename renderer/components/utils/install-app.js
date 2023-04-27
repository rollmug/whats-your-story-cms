import fs from 'fs-extra';
import upath from 'upath';
import axios from 'axios';
import seedDB from './seed-db';
import initEnv from './init-env';

const installAppFiles = async (appSettings) => {
    const composeDataUrl = 'https://cdn.statically.io/gh/rollmug/static-assets/main/hcc-redux/docker-compose.yml';
    const sqlDataUrl = 'https://cdn.statically.io/gh/rollmug/static-assets/main/hcc-redux/init/01-directus.sql.txt';
    const dirFullPath = appSettings.directory;
    const results = {};

    try {
        const composeContents = await axios.get(composeDataUrl);
        const sqlContents = await axios.get(sqlDataUrl);

        if (fs.existsSync(dirFullPath) === true) {
            const appDir = upath.join(dirFullPath, 'directus-cms');
            const envFile = upath.join(appDir, '.env');
            const composeFile = upath.join(appDir, 'docker-compose.yml');
            const initDir = upath.join(appDir, 'init');
            const directusDir = upath.join(appDir, 'directus', 'uploads');
            const mysqlDir = upath.join(appDir, 'mysql');
            const directusSQLFile = upath.join(initDir, '01-directus.sql');
            const otherSqlFiles = ['02-user.sql', '03-components.sql'];

            try {
                if (fs.existsSync(appDir) === false) {
                    await fs.mkdir(appDir);
                }

                await fs.ensureDir(directusDir);
                await fs.ensureDir(initDir);
                await fs.ensureDir(mysqlDir);

                otherSqlFiles.forEach((fileName) => {
                    fs.ensureFile(upath.join(initDir, fileName));
                });

                await fs.outputFile(directusSQLFile, sqlContents.data);
                await fs.outputFile(composeFile, composeContents.data);

                await seedDB(appDir, appSettings);
                await initEnv(envFile, appSettings);

                results.success = 1;
            } catch (e) {
                results.error = "Error creating application files.";
            }
        } else {
            results.error = "Directory could not be found.";
        }
    } catch (error) {
        results.error = 'Error retrieving app data from server.';
    }

    return results;
}

export default installAppFiles;