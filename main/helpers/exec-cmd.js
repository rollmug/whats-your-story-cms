import { exec } from 'child_process';
import fixPath from 'fix-path';
import os from 'os';
const platform = os.platform();

const execShellCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        if(platform !== 'win32') fixPath();
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

export default execShellCommand;
