import React, {Suspense, useState} from "react";
import { memoizeOne } from 'memoize-one';
import {useLocation} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import TagSearchBar from "../../components/TagSearchBar";
import {Redirect} from 'react-router-dom';
import Rest from "../../Rest";
import useFetch from "fetch-suspense";
import CategorySelector from "../../components/CategorySelector";

import {makeStyles} from "@material-ui/core/styles";
import {GetApp} from "@material-ui/icons";
import {Button, Grid, Modal, Paper, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => {
    const backgroundColor =
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];
    return({
    searchBar: {
        marginTop: '10px',
        width: '100%',
        display: 'inline-flex'
    },
    selector: {
        display: 'flex',
        alignItems: 'middle',
        width: 'calc(18% - 60px)',
        margin: '10px 10px 10px 20px'
    },
    tags: {
        display: 'inline-block',
        width: '80%',
        margin: '10px 20px 10px 10px',
    },
    searchRes: {
        height: '150px',
        borderBottom: '1px solid '+theme.palette.divider,
        margin: '20px',
        textAlign: 'left',
        display: 'block',
        color: theme.palette.text.primary,
    },
    searchImg: {
        height: '120px',
        width: '120px',
        marginTop: 'auto',
        marginBottom: 'auto',
        borderRadius: '4px',
    },
    tag: {
        display: 'inline-block',
        marginLeft: '5px',
        border: '1px solid transparent',
        backgroundColor: backgroundColor,
        borderRadius: '16px',
        padding: '2px 8px 2px 8px',
        fontSize: '13px',
        textTransform: 'none'
    },
    searchResChildren: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    downloadButton: {
        color: theme.palette.text.primary,
        margin:"auto",
        textAlign:"right"
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        marginBottom: '20px',
        maxHeight: '150px',
        textAlign: 'left'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})});

function SearchResults(props) {
    let search = useFetch(Rest.searchObjects(props.category,props.tags));

    return <>
        <p style={{textAlign:"right", marginRight: "20px"}}>Results: {search.length}</p>
        {search.map(res=><SearchResult setTags={props.setTags} key={res._id} object={res}/>)}
    </>
}

function SearchResult(props) {
    let classes = useStyles()
    const [open, setOpen] = React.useState(false);

    let img;

    if (props.object.previewImage) {
        img = (<div>
            <Button className={`${classes.searchImg} `} style={{padding:0}} onClick={()=>setOpen(true)}>
                <img style={{maxWidth:120,maxHeight:120,borderRadius:"4px"}} alt="img" src={props.object.previewImage}/>
            </Button>
            <Modal open={open} onClose={()=>setOpen(false)} className={classes.modal}>
                <img alt="img" style={{maxHeight:"90vh",maxWidth:"90vw"}} src={props.object.previewImage}/>
            </Modal>
        </div>)
    }

    return <Paper className={classes.paper}>
        <Grid container spacing={2}>
        <Grid xs item>
            {img}
        </Grid>
        <Grid xs={6} item container direction={"column"} justify={"space-between"}>
            <Typography>Name: <b>{props.object.name}</b></Typography>
            <Typography>Size: {(Math.ceil(props.object.fileSize/1048576))+"MB"}</Typography>
            <Typography>Tags: {props.object.tags.map(t=>
                <Button
                    onClick={()=>props.setTags([t.name])}
                    className={classes.tag}
                    key={t._id}>
                        {t.name}
                </Button>
            )}</Typography>
        </Grid>
        <Grid xs container item button className={`${classes.searchResChildren} ${classes.downloadButton}`}>
            <Button href={props.object.file}>
                <GetApp style={{width:"60px",height:"60px", margin:"auto"}}/>
            </Button>
        </Grid>
    </Grid>
    </Paper>;
}

function updateValues(t,c,l) {
    let search = "?"

    if (t.length>=1) {
        search+="tags="+JSON.stringify(t)+"&";
    }
    if (c!=null) {
        search+="category="+c;
    }

    return `${l.pathname+search}`
}

export default function Search() {
    let location = useLocation();
    let classes = useStyles()
    let params = new URLSearchParams(location.search);

    let tags = JSON.parse(params.get('tags')) || [];
    let category = params.get('category');

    let [redirPath,updatePath] = useState(location.pathname+location.search)

    let redir;
    if (redirPath) redir = <Redirect push to={redirPath}/>

    return (<>
        <Suspense fallback={<CircularProgress/>}>
            <div className={classes.searchBar}>
                <div className={classes.selector}>
                    <CategorySelector value={category} onChange={(e,v)=>{updatePath(updateValues(tags,v,location))}}/>
                </div>
                <div className={classes.tags}>
                    <TagSearchBar value={tags} onChange={(e,v)=>{updatePath(updateValues(v,category,location))}}/>
                </div>
            </div>
            <br/>
            <Suspense fallback={<CircularProgress/>}>
                <SearchResults style={{display:'block'}} setTags={t=>updatePath(updateValues(t,category,location))} tags={tags} category={category}/>
            </Suspense>
            {redir}
        </Suspense>
    </>);
}