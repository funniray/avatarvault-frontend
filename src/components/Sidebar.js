import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Home, Publish, Search} from "@material-ui/icons";
import {Link} from "react-router-dom";

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
                    <Link className={classes.link} to="/upload">
                        <ListItem button>
                            <ListItemIcon><Publish/></ListItemIcon>
                            <ListItemText primary="Upload" />
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