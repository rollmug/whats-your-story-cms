import React, { Fragment } from 'react';
import useSWR from 'swr';
import Alert from '@mui/material/Alert';
import Heading from './heading';
import LinearProgress from '@mui/material/LinearProgress';
import DashboardExited from './dashboard-exited';
import DashboardRunning from './dashboard-running';
import NukeApp from './nuke-app';
import { dockerAppStatus } from './utils/docker-info';

const dockerApp = () => dockerAppStatus().then(res => res);

function Dashboard() {
    const { data, error, isLoading } = useSWR('docker/services', dockerApp, { refreshInterval: 5000 });

    if (isLoading) {
        return (
            <Fragment>
                <LinearProgress></LinearProgress>
            </Fragment>
        );
    }

    if (error) {
        return (
            <Fragment>
                <Fragment>
                    <Alert severity="info" className="my-6">Loading dashboard...</Alert>
                    <article className="prose prose-slate my-4">Hang tight. Checking the status of all services and loading the dashboard.</article>
                    <LinearProgress></LinearProgress>
                </Fragment>
            </Fragment>
        );
    }

    if (typeof data === 'object' && Object.keys(data).length > 0) {

        if (data.services) {
            const serv = data.services;
            let directusUp = false,
                directusStatus = 'Checking CMS status...',
                mysqlUp = false,
                mySqlStatus = 'Checking database status...';

            if (typeof serv.directus === 'object') {
                if (serv.directus.State === 'running') {
                    directusUp = true;
                    directusStatus = `CMS service is running. ${serv.directus.Status ? serv.directus.Status : ''}`;
                }
            }

            if (typeof serv.mysql === 'object') {
                if (serv.mysql.State === 'running') {
                    mysqlUp = true;
                    mySqlStatus = `Database is running. ${serv.mysql.Status ? serv.mysql.Status : ''}`;
                }
            }

            if (directusUp && mysqlUp) {
                return (
                    <Fragment>
                        <Alert severity={directusUp ? 'success' : 'warning'} className="my-6">{directusStatus}</Alert>
                        <Alert severity={mysqlUp ? 'success' : 'warning'} className="my-6">{mySqlStatus}</Alert>
                        <DashboardRunning></DashboardRunning>
                        <NukeApp></NukeApp>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <Alert severity={directusUp ? 'success' : 'warning'} className="my-6">{directusUp ? directusStatus : 'CMS service is not running.'}</Alert>
                        <Alert severity={mysqlUp ? 'success' : 'warning'} className="my-6">{mysqlUp ? mySqlStatus : 'Database is not running.'}</Alert>
                        <DashboardExited></DashboardExited>
                        <NukeApp></NukeApp>
                    </Fragment>
                );
            }
        } else {
            return (
                <Fragment>
                    <Alert severity="warning" className="my-6">CMS service is not running.</Alert>
                    <Alert severity="warning" className="my-6">Database is not running.</Alert>
                    <DashboardExited></DashboardExited>
                    <NukeApp></NukeApp>
                </Fragment>
            );
        }
    } else {
        console.log(data);
    }
}

export default Dashboard;