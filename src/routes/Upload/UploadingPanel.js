import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
    root: {
        width: '100%',
        borderBottom: "1px solid black"
    },
});

function UploadPane(props) {
    console.log("renderPane")
    const classes = useStyles();
    const [progress, setProgress] = React.useState(0);
    const [addedListener, setAddedListener] = React.useState(false);
    if (!props.file.finished&&!addedListener) {
        setAddedListener(true);
        props.file.addEventListener(e => {
            setProgress(Math.round((100 * e.loaded) / e.total));
            console.log("update");
        })
    } else if (props.file.finished) {
        if (progress!==100)
            setProgress(100);
    }

    return (
        <div className={classes.root}>
            <p>{props.file.name}</p>
            <LinearProgress variant={progress > 0 ? "determinate" : "indeterminate"} value={progress}/>
        </div>
    );
}

export default function UploadingPanel(props) {
    console.log("render");
    return <>{props.files.map(file=><UploadPane key={file.name} file={file}/>)}</>
}