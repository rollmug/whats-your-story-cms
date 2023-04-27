import { exec } from 'child_process';
import fixPath from 'fix-path';

const execShellCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        fixPath();
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

export default execShellCommand;