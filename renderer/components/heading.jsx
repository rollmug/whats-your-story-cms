import React, { Fragment } from "react";
import { Typography } from "@material-tailwind/react";

export default function Heading({ text, color }) {
    return (
        <Fragment>
            <Typography variant="h2" color={color}>{text}</Typography>
            <hr className="my-4"></hr>
        </Fragment>
    )
}