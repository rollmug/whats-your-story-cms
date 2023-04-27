import electron from 'electron';
import React, { Fragment } from 'react';
import { Button } from "@material-tailwind/react";
import LaunchIcon from '@mui/icons-material/Launch';

const ipcRenderer = electron.ipcRenderer || false;

const DockerInstall = () => {

    const openDockerWeb = () => {
        ipcRenderer.send('open-website', 'https://www.docker.com');
    }

    return (
        <Fragment>
            <article className="prose prose-slate my-4">
                <p>The first step is to install Docker. Click the button below to download the appropriate version for your system, and follow the instructions:</p>
            </article>

            <div className="my-6">
                <Button variant="filled" className="flex items-center gap-3" onClick={openDockerWeb}>
                    Download Docker 
                    <LaunchIcon className="h-4 w-4"></LaunchIcon>
                </Button>
            </div>

            <article className="prose prose-slate my-4">
                <p>Once you have the <b>Docker Desktop</b> application installed and running, click the below button to continue:</p>
            </article>
            
        </Fragment>
    );
};

export default DockerInstall;