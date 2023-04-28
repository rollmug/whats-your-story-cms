import execShellCommand from "./exec-cmd";

const launchMySQL = async (composeFile) => {
    const launch = await execShellCommand(`docker-compose -f "${composeFile}" up -d mysql_wys`);
    return launch;
}

export default launchMySQL;