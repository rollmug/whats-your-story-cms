import electron from 'electron';
import React, { Fragment } from 'react';
import Heading from './heading';
import Alert from '@mui/material/Alert';
import { Button } from "@material-tailwind/react";
import AutorenewIcon from '@mui/icons-material/Autorenew';

import DockerInstall from './docker-install';
import DockerLaunch from './docker-launch';

import { useRouter } from 'next/router';
import WelcomeAbout from './welcome-about';

const ipcRenderer = electron.ipcRenderer || false;

export default function Docker({ dockerInstalled, dockerRunning, dockerError }) {
    const router = useRouter();
    let initMsg, initAlert, contentMain;

    //only two scenarios if we're here: it's not installed, or it's not running
    if (!dockerInstalled) {
        initMsg = 'Docker is not installed.';
        initAlert = 'error';
        contentMain = (
            <DockerInstall></DockerInstall>
        );
    } else {
        if (dockerError) {
            initMsg = dockerError;
            initAlert = 'error';
            contentMain = (
                <Fragment>
                    <article className="prose prose-slate my-4">
                        <p>Please try again.</p>
                    </article>
                </Fragment>
            );
        } else {
            initMsg = 'Docker is not running.';
            initAlert = 'warning';
            contentMain = (
                <DockerLaunch></DockerLaunch>
            );
        }
    }

    const [message, setMessage] = React.useState(initMsg);
    const [alertType, setAlertType] = React.useState(initAlert);

    const dockerCheck = () => {
        ipcRenderer.send('docker-check', 'update');
    }

    React.useEffect(() => {
        //dockerCheck(); //we can do this on entry

        ipcRenderer.on('docker-result', (event, data) => {
            //console.log(data);

            //if everything checks out, send back to dashboard
            if (data.alert === 'success') {
                router.reload();
            } else {
                setMessage(data.msg);
                setAlertType(data.alert);
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('docker-result');
        }
    }, []);

    return (
        <Fragment>
            <Heading text="Setup and Installation"></Heading>
            <Alert severity={alertType} className="my-6">{message}</Alert>

            <WelcomeAbout></WelcomeAbout>

            {contentMain}

            <div className="my-6">
                <Button variant="filled" color="green" className="flex items-center gap-3" onClick={dockerCheck}>
                    Check Docker Status
                    <AutorenewIcon className="h-4 w-4"></AutorenewIcon>
                </Button>
            </div>
        </Fragment>
    )
};