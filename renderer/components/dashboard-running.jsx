import electron from 'electron';
import React, { Fragment } from 'react';
import { Button } from "@material-tailwind/react";
import Link from 'next/link';
import LaunchIcon from '@mui/icons-material/Launch';
import StopIcon from '@mui/icons-material/Stop';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/router';

const ipcRenderer = electron.ipcRenderer || false;

function DashboardRunning() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = React.useState();
    const [btnMsg, setBtnMsg] = React.useState('Stop Services');
    const [btnDisabled, setBtnDisabled] = React.useState(false);

    const launchCMS = () => {
        ipcRenderer.send('launch-cms', true);
    }

    const stopServices = () => {
        setBtnMsg('Stopping...');
        setBtnDisabled(true);
        ipcRenderer.invoke('docker-compose-down', true);
    }

    React.useEffect(() => {
        ipcRenderer.on('services-stopped', (event, data) => {
            setBtnMsg('Stop Services');
            setBtnDisabled(false);
            if (data.error) {
                setErrorMsg(<Alert severity="error" className="my-6">{data.error}</Alert>);
            } else {
                router.reload();
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('services-stopped');
        }
    }, []);

    return (
        <Fragment>
            <article className="prose prose-slate my-2">
                <p>All services are up and running! You can manage your content by launching the CMS, or stop the services if they aren’t in use.</p>
            </article>

            {errorMsg}

            <div className="flex flex-row w-full gap-4 my-6">
                <Button onClick={launchCMS} variant="filled" color="indigo" className="w-full flex items-center justify-center gap-3">Launch CMS <LaunchIcon className="h-4 w-4" /></Button>
                <Button onClick={stopServices} variant="filled" color="pink" className="w-full flex items-center justify-center gap-3" disabled={btnDisabled}>{btnMsg} <StopIcon className="h-5 w-5" /></Button>
            </div>

            <article className="prose prose-slate my-2">If you need your configuration settings, you can <Link href="/build">get them here</Link>.</article>
        </Fragment>
    )
}

export default DashboardRunning;