import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {Home, Publish, Search} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {Grid} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    link: {
        color:theme.palette.text.primary,
        textDecoration: "none"
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

function GrantSpecificItem(props) {
    const loginState = useSelector(state => state.login);
    if (loginState.account.grants[props.grant]) {
        return props.children;
    }

    return <React.Fragment/>
}

export default function Sidebar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <List>
                    <ListItem>
                        <ListItemText primary={"Avatar Vault"} secondary={"By some people"} />
                    </ListItem>
                    <Link className={classes.link} to="/">
                        <ListItem button>
                            <ListItemIcon><Home/></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </Link>
                    <Link className={classes.link} to="/search">
                        <ListItem button>
                            <ListItemIcon><Search/></ListItemIcon>
                            <ListItemText primary="Search" />
                        </ListItem>
                    </Link>
                    <GrantSpecificItem grant={"upload"}>
                        <Link className={classes.link} to="/upload">
                            <ListItem button>
                                <ListItemIcon><Publish/></ListItemIcon>
                                <ListItemText primary="Upload" />
                            </ListItem>
                        </Link>
                    </GrantSpecificItem>
                    <Link className={classes.link} to="/login">
                        <ListItem button>
                            <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                            <ListItemText primary="Account" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <main className={classes.content}>
                {props.children}
            </main>
        </div>
    );
}