import electron from 'electron';
import React, { Fragment } from 'react';
import { Button } from "@material-tailwind/react";
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from 'next/router';

const ipcRenderer = electron.ipcRenderer || false;

function DashboardExited() {
    const router = useRouter();
    const [btnText, setBtnText] = React.useState('Launch Services');
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState('');
    const [message, setMessage] = React.useState('It looks like some services aren’t up and running. To get them started, just click the button below:');

    const startMySQL = () => {
        setMessage('Starting up database...');
        setBtnText('Launching services...');
        setBtnDisabled(true);
        setLoading(<div><LinearProgress /></div>);
        ipcRenderer.invoke('init-mysql', true);
    }

    const startDirectus = () => {
        setMessage('Database started, waiting for CMS service...');
        ipcRenderer.invoke('init-directus', false); // createUser should be true or false
    }

    React.useEffect(() => {
        ipcRenderer.on('mysql-launch', (event, data) => {
            if (data.success) {
                startDirectus();
            } else {
                setLoading('');
                setBtnDisabled(false);
                setBtnText('Launch Services');
                setMessage(data.error);
            }
        });

        ipcRenderer.on('directus-launch', (event, data) => {
            if (data.success) {
                router.reload();
            } else {
                setLoading('');
                setBtnDisabled(false);
                setBtnText('Launch Services');
                setMessage(data.error);
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('mysql-launch');
            ipcRenderer.removeAllListeners('directus-launch');
        }
    }, []);

    return (
        <Fragment>
            <article className="prose prose-slate my-2">
                {message}
            </article>

            {loading}

            <div className="flex w-full gap-4 my-6">
                <Button onClick={startMySQL} variant="filled" color="green" className="w-full flex items-center justify-center gap-3" disabled={btnDisabled}>{btnText}</Button>
            </div>
        </Fragment>
    )
}

export default DashboardExited;