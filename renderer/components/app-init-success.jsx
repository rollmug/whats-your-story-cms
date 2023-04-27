import electron from 'electron';
import useSWR from 'swr';
import React, { Fragment } from 'react';
import { Button } from "@material-tailwind/react";
import { Typography } from '@mui/material';
import { Code } from "./utils/code-blocks";
import Layout from './layout';
import Heading from './heading';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import LaunchIcon from '@mui/icons-material/Launch';
import apiPathFormat from './utils/api-path';
import getSettingsFromCache from '../components/utils/cache-settings';

const ipcRenderer = electron.ipcRenderer || false;

const settingsFetch = () => getSettingsFromCache().then(res => res);

const AppInitSuccess = () => {
    const { data: appSettings, error, isLoading } = useSWR('app/settings', settingsFetch);
    const [publicUrl, setPublicUrl] = React.useState(`http://localhost`);

    const launchCMS = () => {
        ipcRenderer.send('launch-cms', true);
    }

    React.useEffect(() => {
        const getApiPath = async () => {
            const settings = await getSettingsFromCache();
            const { publicUrl, apiEndpoint } = await apiPathFormat(settings);
            return publicUrl;
        }
        
        getApiPath().then(url => {
            setPublicUrl(url);
        });

        return () => {
            
        }
    }, []);

    if (error) {
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

    if (isLoading) {
        return (
            <Layout>
                <Heading text="Loading..."></Heading>
                <Fragment>
                    <LinearProgress></LinearProgress>
                </Fragment>
            </Layout>
        );
    }

    return (
        <Fragment>
            <article className="prose prose-slate my-4">The application has been installed successfully! Take note of the email and password that you’ll use to login to the CMS:</article>

            <Paper elevation={3} className="py-4 px-4 my-6">
                <Typography display="block" variant="body1">
                    <Typography variant="overline" display="inline">Email: </Typography>
                    <Code text={appSettings.email}></Code>
                </Typography>

                <Typography display="block" variant="body1">
                    <Typography variant="overline" display="inline">Password: </Typography>
                    <Code text={appSettings.password}></Code>
                </Typography>
            </Paper>

            <article className="prose prose-slate my-4">Also copy the API Path and API Key that you will need to add to the front-end application config file:</article>
            <Paper elevation={3} className="py-4 px-4 my-6">
                <Typography display="block" variant="body1">
                    <Typography variant="overline" display="inline">API Path: </Typography>
                    <Code text={publicUrl}></Code>
                </Typography>

                <Typography display="block" variant="body1">
                    <Typography variant="overline" display="inline">API Key: </Typography>
                    <Code text={appSettings.directusAPIToken}></Code>
                </Typography>
            </Paper>

            <article className="prose prose-slate mt-2 mb-4">You can now head over to the dashboard, where you can launch your CMS and get started building your content.</article>

            <div className="flex flex-col gap-4 mt-6">
                <Button onClick={launchCMS} variant="filled" color="indigo" className="flex items-center justify-center gap-3">Launch CMS <LaunchIcon className="h-4 w-4" /> </Button>
                <Link href="/"><Button variant="filled">Go to Dashboard</Button></Link>
            </div>

        </Fragment>
    );
}

export default AppInitSuccess;