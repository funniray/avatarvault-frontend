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
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

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
    },
    panel: {
        height: 'auto'
    }
}));

export default function Upload() {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [files,setFiles] = React.useState([]);
    const loginState = useSelector(state => state.login);

    if (!loginState.loggedIn){
        return(<React.Fragment>
            <p>You must be logged in to upload</p>
            <Link to={"/login"}>
                <Button color={"primary"} variant={"contained"}>Login</Button>
            </Link>
        </React.Fragment>)
    }

    if (!loginState.account.grants.upload) {
        return(<React.Fragment>
            <p>Your account isn't allowed to upload :(</p>
        </React.Fragment>)
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
                    style={{height:"85vh"}}
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