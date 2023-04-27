import fs from 'fs-extra';
import apiPathFormat from './api-path';

const initEnv = async (envFile, appSettings) => {
    const { publicUrl, apiEndpoint } = await apiPathFormat(appSettings);

    const contents = `# Environment variables\n\n` +

        `# User email and password to login to Directus:\n` +
        `USER_EMAIL="${appSettings.email}"\n` +
        `USER_PASSWORD="${appSettings.password}"\n` +
        `USER_TOKEN="${appSettings.directusAPIToken}"\n\n` +

        `# Define the mysql user name and password:\n` +
        `MYSQL_USER="admin"\n` +
        `MYSQL_PASS="${appSettings.mysqlPass}"\n\n` +

        `# Give your database a name:\n` +
        `MYSQL_DB="directus"\n\n` +

        `# Set a root password for MySQL to something secure:\n` +
        `MYSQL_ROOT_PASS="${appSettings.mysqlRootPass}"\n\n` +

        `# Set the domain for directus to use:\n` +
        `DIRECTUS_DOMAIN="${appSettings.domain}"\n` +
        `DIRECTUS_PORT="${appSettings.port}"\n` +
        `PUBLIC_URL="${publicUrl}"\n` +
        `API_ENDPOINT="${apiEndpoint}"`;

    await fs.outputFile(envFile, contents);
}

export default initEnv;