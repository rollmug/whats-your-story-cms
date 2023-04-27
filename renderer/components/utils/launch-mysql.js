import execShellCommand from "./exec-cmd";

const launchMySQL = async (composeFile) => {
    const launch = await execShellCommand(`docker-compose -f ${composeFile} up -d mysql`);
    return launch;
}

export default launchMySQL;