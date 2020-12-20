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
    const classes = useStyles();
    const [progress, setProgress] = React.useState(0);
    const [addedListener, setAddedListener] = React.useState(false);
    if (!props.file.finished&&!addedListener) {
        setAddedListener(true);
        props.file.addEventListener(e => {
            let prog = Math.round((100 * e.loaded) / e.total);
            setProgress(prog);
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
    return <>{props.files.map(file=><UploadPane key={file.name} file={file}/>)}</>
}