import React, { Fragment } from 'react';

const DockerLaunch = () => {
    return (
        <Fragment>
            <article className="prose prose-slate my-4">
                <p>Good news! Docker is installed properly. The next step is to open the <b>Docker Desktop</b> application on your computer.</p>
            </article>

            <article className="prose prose-slate my-4">
                <p>Once you have done that and Docker is running, click the below button to continue:</p>
            </article>

        </Fragment>
    );
};

export default DockerLaunch;