import electron from 'electron';
import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Button, Typography } from "@material-tailwind/react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';

const ipcRenderer = electron.ipcRenderer || false;

function StartContent() {
    return (<Fragment>
        <article className="prose prose-slate my-4">
            <p>If you want a fresh start, you can completely uninstall the database and CMS, so that you can re-intstall with a clean slate.</p>
        </article>
    </Fragment>);
}

function DeleteContent() {
    return (<Fragment>
        <article className="prose prose-slate my-4">
            <p>Stopping all services...</p>
        </article>
        <LinearProgress></LinearProgress>
    </Fragment>);
}

function StoppedContent() {
    return (<Fragment>
        <article className="prose prose-slate my-4">
            <p>Uninstalling...</p>
        </article>
        <LinearProgress></LinearProgress>
    </Fragment>);
}

function NukeApp() {
    const router = useRouter();
    const [content, setContent] = React.useState(<StartContent></StartContent>);
    const [open, setOpen] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const uninstallApp = () => {
        ipcRenderer.invoke('nuke-app', true);
        setBtnDisabled(true);
        setOpen(false);
        setContent(<DeleteContent></DeleteContent>);
    }

    React.useEffect(() => {
        ipcRenderer.on('app-stopped', (event, data) => {
            setContent(<StoppedContent></StoppedContent>);
        });

        ipcRenderer.on('app-nuked', (event, data) => {
            router.reload();
        });

        return () => {
            ipcRenderer.removeAllListeners('app-stopped');
            ipcRenderer.removeAllListeners('app-nuked');
        }
    }, []);

    return (
        <Fragment>
            <hr className="mt-10 mb-8"></hr>
            <Typography variant="h5" color="red">Danger Zone:</Typography>

            <div className="my-5">{content}</div>

            <div className="my-5">
                <Button onClick={handleClickOpen} variant="filled" color="red" className="flex items-center justify-center gap-3" disabled={btnDisabled}>
                    Uninstall <DeleteForeverIcon className="h-5 w-5" />
                </Button>
            </div>

            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>{"Danger!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to do this? There is no undo. 
                        <strong> Be sure to back up any data you want to keep before proceeding.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="mb-5 mx-5">
                    <Button onClick={handleClose} color="gray">No, Cancel</Button>
                    <Button onClick={uninstallApp} color="red">Yes, proceed.</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export default NukeApp;