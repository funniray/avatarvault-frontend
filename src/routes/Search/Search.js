import React, {Suspense, useState} from "react";
import { memoizeOne } from 'memoize-one';
import {useLocation} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import TagSearchBar from "../../components/TagSearchBar";
import {Redirect} from 'react-router-dom';
import Rest from "../../Rest";
import useFetch from "fetch-suspense";
import CategorySelector from "../../components/CategorySelector";

import "./Search.css";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
    //why
    const backgroundColor =
        theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];
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
        margin: '10px',
        overflow: 'hidden',
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
    },
    searchResChildren: {
        display: 'inline-block',
        verticalAlign: 'middle',
    }
})});

function SearchResults(props) {
    let search = useFetch(Rest.searchObjects(props.category,props.tags));

    return <>
        <p style={{textAlign:"right", marginRight: "20px"}}>Results: {search.length}</p>
        {search.map(res=><SearchResult key={res._id} object={res}/>)}
    </>
}

function SearchResult(props) {
    let classes = useStyles()
    return <a className={classes.searchRes} href={props.object.file}>
        <img className={`${classes.searchImg} ${classes.searchResChildren}`} alt="img" src={props.object.previewImage}/>
        <div className={classes.searchResChildren}>
            <p>Name: <b>{props.object.name}</b></p>
            <p>Size: {(Math.ceil(props.object.fileSize/1048576))+"MB"}</p>
            <div><p style={{display:"inline-block"}}>Tags: </p>{props.object.tags.map(t=><p className={classes.tag} key={t._id}>{t.name}</p>)}</div>
        </div>
    </a>;
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
                <SearchResults style={{display:'block'}} tags={tags} category={category}/>
            </Suspense>
            <Redirect push to={redirPath}/>
        </Suspense>
    </>);
}