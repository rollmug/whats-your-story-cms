import { Typography } from "@material-tailwind/react";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export function Code({ text }) {
    return (
        <code className="text-teal-500" style={{ fontSize: ".8rem" }}>{text}</code>
    )
}

export function ErrorText({ text }) {
    return (
        <Typography variant="small" className="flex items-center gap-1 text-red-500 -mt-1 mb-1">
            <ErrorOutlineOutlinedIcon className="h-5 w-5"></ErrorOutlineOutlinedIcon>
            {text}
        </Typography>
    )
}