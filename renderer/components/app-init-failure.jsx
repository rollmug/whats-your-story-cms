import electron from 'electron';
import React, { Fragment } from "react";
import { Button } from "@material-tailwind/react";
import Link from 'next/link';

const ipcRenderer = electron.ipcRenderer || false;

/**
 * 
 * on install failure, we need to:
 * - stop any running docker compose images
 * - delete the app directory
 * - send them back to the config page so they can try again.
 */

const AppInitFailure = () => {

    const forceUninstall = () => {
        ipcRenderer.invoke('force-uninstall', null);
    }

    React.useEffect(() => {
        forceUninstall();

        ipcRenderer.on('app-uninstalled', (event, data) => {
            setBtn(<Link href="/"><Button variant="filled">Re-initialize App</Button></Link>);
        });

        return () => {
            ipcRenderer.removeAllListeners('app-uninstalled');
        }
    }, []);

    const [btn, setBtn] = React.useState(<Button variant="filled" disabled>Working...</Button>);

    return (
        <Fragment>
            <article className="prose prose-slate my-4">There seems to be some problems initializing the database. Click the button below to go back and resolve any problems.</article>
            {btn}
        </Fragment>
    );
}

export default AppInitFailure;