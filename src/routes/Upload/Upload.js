import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import UploadInfoPanel from "./UploadInfoPanel";
import UploadingPanel from "./UploadingPanel"
import useFetch from "fetch-suspense";
import Rest from "../../Rest";
import {Button, Input} from "@material-ui/core";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'relative',
    }
}));

export default function Upload() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [files,setFiles] = React.useState([]);
    const [password,setPassword] = React.useState();
    const passRef = React.useRef();

    const passwordValid = useFetch(Rest.checkPass(),{method:'POST',body:JSON.stringify({password:password}),headers: {
            'Content-Type': 'application/json'
        }});

    if (!passwordValid) {

        return(<div>
            <p>Password is invalid. Please enter the correct password.</p>
            <Input type="password" ref={passRef}/>
            <Button onClick={()=>setPassword(passRef.current.firstChild.value)}>Check</Button>
        </div>)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="action tabs example"
                >
                    <Tab label="Upload List" {...a11yProps(0)} />
                    <Tab label="New Upload" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <UploadingPanel files={files}/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <UploadInfoPanel files={files} setUploadingFiles={setFiles}/>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}