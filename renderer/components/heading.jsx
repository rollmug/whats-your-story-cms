import React, { Fragment } from "react";
import { Typography } from "@material-tailwind/react";

export default function Heading({ text }) {
    return (
        <Fragment>
            <Typography variant="h2">{text}</Typography>
            <hr className="my-4"></hr>
        </Fragment>
    )
}