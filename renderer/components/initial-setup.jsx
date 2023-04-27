import electron from 'electron';
import React, { Fragment } from 'react';
import { Card, Input, Select, Option, Button, Typography } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { Code, ErrorText } from './utils/code-blocks';
import { yupResolver } from '@hookform/resolvers/yup';
import Router from 'next/router';
import * as yup from 'yup';
import generator from 'generate-password';
import WelcomeAbout from './welcome-about';
import installAppFiles from './utils/install-app';

const ipcRenderer = electron.ipcRenderer || false;

const InitialSetup = () => {
    const schema = yup.object({
        email: yup.string().required('Email is required.').email('Email is invalid.'),
        password: yup.string().min(8, "Must be at least 8 characters").required('Password is required.'),
        install: yup.string().required('Choose an install type'),
        directory: yup.string().required("Please choose a directory."),
        domain: yup.string().required('Domain is required.').test(
            'is-url',
            'Domain is not valid.',
            (value, context) => {
                if (value === 'localhost') {
                    return true;
                } else {
                    try {
                        new URL(value);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            },
        ),
        port: yup.number().typeError('Port must be a number')
            .required('Port is required.')
            .positive('Port must be a number')
            .integer('Port must be a number.'),

    }).required();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: "onBlur", reValidateMode: "onChange", resolver: yupResolver(schema) });

    const initStates = {
        color: "blue",
        text: "Choose a Folder...",
        helper: "Choose where to install your database and app files."
    }

    const defaults = {
        port: 8055,
        domain: "localhost",
        install: "",
        email: "",
        password: "",
        directory: ""
    }

    const [directory, setDirectory] = React.useState("");
    const [dirBtn, setDirBtn] = React.useState(initStates);
    const [port, setPort] = React.useState(defaults.port);
    const [domain, setDomain] = React.useState(defaults.domain);
    const [install, setInstall] = React.useState(defaults.install);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [btnText, setBtnText] = React.useState('Save & Install');
    const [progressBar, setProgressBar] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');

    const openDirDialog = () => {
        ipcRenderer.send('select-dirs', 'update');
    }

    const handleDomainChange = (domain) => {
        setDomain(domain);
    }

    const handlePortChange = (port) => {
        setPort(port);
    }

    const handleInstallSelectChange = (value) => {
        setInstall(value);
        setValue('install', value, { shouldValidate: true });
    }

    const dirSelectSuccess = () => {
        setDirBtn({
            color: "green",
            text: "Change Folder",
            helper: <span>Here’s where we’ll install your database and app files:</span>
        });
    }

    const handleFormSubmit = async (data) => {
        setBtnDisabled(true);
        setBtnText('Saving and installing...');
        setProgressBar(<LinearProgress></LinearProgress>);
        setErrorMsg('');

        const appSettings = await ipcRenderer.invoke('get-settings', 'appSettings');
        let dbInitialized = false;

        if (typeof appSettings === 'object' && Object.keys(appSettings).length > 0) {
            dbInitialized = appSettings.dbInitialized;
        }

        if (dbInitialized) {
            //this is so we don't overwrite them if MySQL has already been created
            data.mysqlPass = appSettings.mysqlPass;
            data.mysqlRootPass = appSettings.mysqlRootPass;
            data.directusAPIToken = appSettings.directusAPIToken;
        } else {
            data.mysqlPass = generator.generate({ length: 14, numbers: true, symbols: false });
            data.mysqlRootPass = generator.generate({ length: 14, numbers: true, symbols: false });
            data.directusAPIToken = generator.generate({ length: 22, numbers: true, symbols: false });
        }

        data.installed = false;
        data.dbInitialized = false;

        const newSettings = await ipcRenderer.invoke('update-settings', data);
        const install = await installAppFiles(newSettings);

        if (install.success) {
            await ipcRenderer.invoke('install-success', null);
            Router.push('/build');
        } else {
            await ipcRenderer.invoke('install-failure', null);
            setBtnDisabled(false);
            setBtnText('Save & Install');
            setProgressBar('');
            setErrorMsg(<Alert severity="error" className="my-6">{install.error}</Alert>);
        }
    }

    React.useEffect(() => {
        const loadAppSettings = async () => {
            const appSettings = await ipcRenderer.invoke('get-settings', 'appSettings');
            if (typeof appSettings === 'object' && Object.keys(appSettings).length > 0) {
                for (const prop in appSettings) {
                    if (defaults.hasOwnProperty(prop)) {
                        setValue(prop, appSettings[prop], { shouldValidate: true });

                        if (prop === 'install') {
                            setInstall(appSettings[prop]);
                        }

                        if (prop === 'directory') {
                            setDirectory(appSettings[prop]);
                            dirSelectSuccess();
                        }
                    }
                }
            }
        }

        loadAppSettings();

        ipcRenderer.on('select-dirs-result', (event, data) => {
            console.log(data);
            if (typeof data === 'object' && data.length > 0) {
                setDirectory(data[0]);
                setValue('directory', data[0], { shouldValidate: true });
                dirSelectSuccess();
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('select-dirs-result');
        }
    }, []);

    return (
        <Fragment>
            <WelcomeAbout></WelcomeAbout>

            {/* <article className="prose prose-slate mt-2">
                <p>Use the form below to configure your Content Management System (CMS) and server settings.</p>
            </article> */}

            <Alert severity='success' className="mt-6">Use the form below to configure your Content Management System (CMS) and server settings.</Alert>

            {errorMsg}

            <Card color="transparent" shadow={false} className=" -mt-2 text-gray-800 ">
                <form className="mt-8 mb-2 max-w-screen-lg" onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="mb-2 flex flex-col gap-4">
                        
                        
                        <div className="hidden">
                            <div className="mb-3 flex flex-col gap-1">
                                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold ">
                                    App Directory:
                                </Typography>
                                <Button variant="filled" color={dirBtn.color} onClick={openDirDialog}>{dirBtn.text}</Button>
                                <Typography className='mt-1' variant="small">{dirBtn.helper}</Typography>
                                {directory && <Typography variant="small" color="green">{directory}</Typography>}
                                <div className={directory !== '' ? 'hidden' : 'hidden'}>
                                    <Input size="lg" readOnly label="Directory" {...register("directory")} value={directory} />
                                </div>
                                {errors.directory && <ErrorText text={errors.directory.message}></ErrorText>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Typography variant="small" color="blue-gray" className="font-semibold ">
                                Login Details:
                            </Typography>
                            <Typography variant="small">
                                Enter your email and a new password. These are the credentials you’ll use to login to your CMS.
                            </Typography>
                        </div>

                        <Input size="lg" label="Email" {...register("email")} error={errors.email ? true : false} />
                        {errors.email && <ErrorText text={errors.email.message}></ErrorText>}

                        <Input size="lg" label="Password" {...register("password")} error={errors.password ? true : false} />
                        <Typography variant="small" className="-mt-3">
                            Minimum of 8 characters.
                        </Typography>
                        {errors.password && <ErrorText text={errors.password.message}></ErrorText>}


                        <div className="mt-4 flex flex-col gap-1">
                            <Typography variant="small" color="blue-gray" className="font-semibold ">
                                Installation Settings:
                            </Typography>
                            <Typography variant="small">
                                Choose which CMS modules to install on this server.
                                <span className="font-bold"> Note: </span>
                                Only choose <Code text="'All CMS Modules'"></Code> if this is a networked server that other machines will connect to.
                                Otherwise, just choose a single module.
                            </Typography>
                        </div>

                        <div className="w-72">
                            <Select label="Installation Type" value={install} onChange={handleInstallSelectChange}>
                                <Option value="all">All CMS Modules (networked server)</Option>
                                <Option value="spark">Find Your Spark</Option>
                                <Option value="poster">Posters for Change</Option>
                                <Option value="quiz">Super Power Quiz</Option>
                            </Select>

                        </div>

                        <div className="hidden"><Input size="lg" label="Install Type" {...register("install")} value={install} /></div>
                        {errors.install && <ErrorText text={errors.install.message}></ErrorText>}

                        <div className="mt-4 flex flex-col gap-1">
                            <Typography variant="small" color="blue-gray" className="font-semibold ">
                                Advanced Settings:
                            </Typography>
                            <Typography variant="small">
                                If you have your own domain on this server or need to run on a specific port, you can update these as needed. Otherwise, leave as default.
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Input size="lg" label="Domain" {...register("domain")} error={errors.domain ? true : false} onChange={e => handleDomainChange(e.target.value)} value={domain} />
                            <Typography variant="small">
                                Web address to run on. For example, 'https://mydomain.com'. Leave as <Code text="localhost"></Code> if running in local environment, or if unsure.
                            </Typography>
                            {errors.domain && <ErrorText text={errors.domain.message}></ErrorText>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <Input size="lg" type="number" min="0" max="65353" label="Port" {...register("port")} error={errors.port ? true : false} onChange={e => handlePortChange(e.target.value)} value={port} />
                            <Typography variant="small">
                                The port to run the CMS and API server on. If unsure, leave as <Code text="8055"></Code>.
                            </Typography>
                            {errors.port && <ErrorText text={errors.port.message}></ErrorText>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Button type="submit" className="mt-6" color="blue" disabled={btnDisabled} fullWidth>
                            {btnText}
                        </Button>
                        <Typography variant="small">
                            Verify that the above settings are correct, and when ready, click the button to proceed with the install.
                        </Typography>
                    </div>
                </form>
            </Card>

            <div className="my-6">{progressBar}</div>
            {errorMsg}

        </Fragment>
    );
};

export default InitialSetup;