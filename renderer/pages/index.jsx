import useSWR from 'swr';
import React, { Fragment } from 'react';
import Layout from '../components/layout';
import { Button } from "@material-tailwind/react"
import { dockerConfig } from '../components/utils/docker-info';
import Heading from '../components/heading';
import LinearProgress from '@mui/material/LinearProgress';
import Docker from '../components/docker-setup';
import { checkAppInstalled } from '../components/utils/app-settings';
import InitialSetup from '../components/initial-setup';
import Dashboard from '../components/dashboard';
import { useRouter } from 'next/router';

const fetcher = () => dockerConfig().then(res => res);
const appFetcher = () => checkAppInstalled().then(res => res);

function Home() {
    const router = useRouter(); //router.reload();
    const { data: docker, error: dockerError, isLoading } = useSWR('docker', fetcher, { refreshInterval: 10000 });
    const { data: appInstalled } = useSWR('app/installed', appFetcher, { refreshInterval: 10000 });

    if (dockerError) {
        return (
            <Layout>
                <Fragment>
                    <article className="prose prose-slate mt-2">
                        <p>Oops! An error was encountered. You can reload this page, or just wait a few seconds.</p>
                    </article>

                    <Button onClick={router.reload()} variant="filled" color="indigo">Re-load</Button>
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

    if (typeof docker === 'object' && Object.keys(docker).length > 0) {

        if (docker.installed === true && docker.running === true) {

            if (appInstalled) {
                return (
                    <Layout>
                        <Heading text="Dashboard"></Heading>
                        <Dashboard></Dashboard>
                    </Layout>
                );

            } else {
                return (
                    <Layout>
                        <Heading text="What’s Your Story: CMS" color="blue"></Heading>
                        <InitialSetup></InitialSetup>
                    </Layout>
                );
            }
        } else {
            if (docker.installed === false) {
                return (
                    <Layout>
                        <Docker dockerInstalled={docker.installed} dockerRunning={docker.running}></Docker>
                    </Layout>
                );
            } else {
                //installed but not running
                return (
                    <Layout>
                        <Docker dockerInstalled={docker.installed} dockerRunning={docker.running}></Docker>
                    </Layout>
                );
            }
        }
    } else {
        return (
            <Layout>
                <Heading text="Error Retrieving Data"></Heading>
                <Fragment>
                    <article className="prose prose-slate mt-2">
                        <p>An error was encountered, and system data could not be retrieved.</p>
                    </article>
                </Fragment>
            </Layout>
        );
    }
}

export default Home;