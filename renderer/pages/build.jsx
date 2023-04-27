import electron from 'electron';
import useSWR from 'swr';
import Link from 'next/link';
import Layout from '../components/layout';
import React, { Fragment } from "react";
import { Button } from "@material-tailwind/react";
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Heading from '../components/heading';
import getSettingsFromCache from '../components/utils/cache-settings';
import { dockerConfig } from '../components/utils/docker-info';
import AppInitSuccess from '../components/app-init-success';
import AppInitFailure from '../components/app-init-failure';

const ipcRenderer = electron.ipcRenderer || false;

const dockerFetch = () => dockerConfig().then(res => res);
const settingsFetch = () => getSettingsFromCache().then(res => res);

function Build() {
    const { data: appSettings, error: appError, isLoading: appLoading } = useSWR('app/settings', settingsFetch);
    const { data: docker, error: dockerError, isLoading: dockerLoading } = useSWR('docker/status', dockerFetch);

    const [mysqlAlert, setMysqlAlert] = React.useState('Settings saved, and app installed.');
    const [mysqlAlertType, setMysqlAlertType] = React.useState('success');
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [btnText, setBtnText] = React.useState('Initialize Database');
    const [btnHidden, setBtnHidden] = React.useState('');

    const initMySQL = () => {
        setLoading(<LinearProgress></LinearProgress>);
        setBtnDisabled(true);
        setBtnText('Please wait...');
        setMysqlAlert('Initialization in progress...');
        setMysqlAlertType('info');
        ipcRenderer.invoke('init-mysql', null);
    }

    const dbInitialized = (value) => {
        ipcRenderer.invoke('db-initialized', value); // boolean
    }

    const initDirectus = (createUser) => {
        ipcRenderer.invoke('init-directus', createUser); // createUser should be true or false
    }

    const installSuccess = () => {
        ipcRenderer.invoke('install-success', null);
    }

    const installFailure = () => {
        ipcRenderer.invoke('install-failure', null);
    }

    const pgContentInit = (
        <Fragment>
            <article className="prose prose-slate my-4">Now, let’s get the database set up. Click the button below to proceed:</article>
        </Fragment>
    );

    const [pageContent, setPageContent] = React.useState(pgContentInit);
    const [loading, setLoading] = React.useState('');

    React.useEffect(() => {

        //here we'll get the response from the main process when it's ready
        ipcRenderer.on('mysql-launch', (event, data) => {
            if (data.success) {
                setMysqlAlert('Database initialized and running. Initializing CMS...');
                setMysqlAlertType('info');
                setPageContent(<Fragment><article className="prose prose-slate my-4">So far so good! Please wait while the CMS is configured. This can take a minute...</article></Fragment>);
                initDirectus(true); //the true is if it should create the initial user
                dbInitialized(true);
            } else {
                setMysqlAlert(data.error);
                setMysqlAlertType('error');
                setPageContent(<AppInitFailure></AppInitFailure>);
                setLoading('');
                installFailure();
                dbInitialized(false);
            }
        });

        // this is the final part of installation, so if it fails, we should set a flag
        // set a flag on success
        ipcRenderer.on('directus-launch', (event, data) => {
            if (data.success) {
                setBtnHidden('hidden');
                setMysqlAlert('Database and CMS initialized successfully.');
                setMysqlAlertType('success');
                setPageContent(<AppInitSuccess></AppInitSuccess>);
                setLoading('');
                installSuccess(); //sets a flag 'appSettings.installed' = true
            } else {
                setMysqlAlert(data.error);
                setMysqlAlertType('error');
                setLoading('');
                setPageContent(<AppInitFailure></AppInitFailure>);
                installFailure();
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('mysql-launch');
            ipcRenderer.removeAllListeners('directus-launch');
        }

    }, []);

    if (dockerError) {
        return (
            <Layout>
                <Heading text="Error"></Heading>
                <Fragment>
                    <article className="prose prose-slate mt-2">
                        <p>An error was encountered.</p>
                    </article>
                </Fragment>
            </Layout>
        );
    }

    if (dockerLoading) {
        return (
            <Layout>
                <Heading text="Loading..."></Heading>
                <Fragment>
                    <LinearProgress></LinearProgress>
                </Fragment>
            </Layout>
        );
    }

    if (typeof docker === 'object' && Object.keys(docker).length > 0) {
        if (docker.installed === true && docker.running === true) {

            if (typeof appSettings === 'object' && Object.keys(appSettings).length > 0) {
                if (appSettings.installed === true && appSettings.dbInitialized === true) {
                    return (
                        <Layout>
                            <div>
                                <Heading text="Installation"></Heading>
                                <Alert severity="success" className="my-6">Database and CMS initialized successfully.</Alert>
                                <AppInitSuccess></AppInitSuccess>
                            </div>
                        </Layout>
                    );
                } else {
                    return (
                        <Layout>
                            <div>
                                <Heading text="Installation"></Heading>
                                <Alert severity={mysqlAlertType} className="my-6">{mysqlAlert}</Alert>
                                {pageContent}
                                <div className="mt-6">
                                    <Button fullWidth onClick={initMySQL} className={btnHidden} color="blue" disabled={btnDisabled}>
                                        {btnText}
                                    </Button>
                                </div>

                                <div className="my-6">{loading}</div>
                            </div>
                        </Layout>
                    );
                }
            } else {
                return (
                    <Layout>
                        <Heading text="Application Error"></Heading>
                        <Fragment>
                            <Alert severity="danger" className="my-6">Could not retrieve settings.</Alert>
                            <article className="prose prose-slate my-4">There was a problem installing the application. Please click the below button to resolve any issues.</article>
                            <Link href="/"><Button variant="filled">Edit Configuration</Button></Link>
                        </Fragment>
                    </Layout>
                );
            }
        } else {
            //docker not running
            return (
                <Layout>
                    <Heading text="Docker Error"></Heading>
                    <Fragment>
                        <Alert severity="danger" className="my-6">Docker needs to be running.</Alert>
                        <article className="prose prose-slate my-4">There was a problem installing the application. Please click the below button to resolve any issues.</article>
                        <Link href="/"><Button variant="filled">Edit Configuration</Button></Link>
                    </Fragment>
                </Layout>
            );
        }
    } else {
        return (
            <Layout>
                <Heading text="Error Retrieving Data"></Heading>
                <Fragment>
                    <article className="prose prose-slate mt-2">
                        <p>An error was encountered, and system data could not be retrieved.</p>
                    </article>

                    <Link href="/"><Button variant="filled">Try Again</Button></Link>
                </Fragment>
            </Layout>
        );
    }
}

export default Build;