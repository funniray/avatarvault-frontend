import React, {Suspense, useState} from "react";
import { memoizeOne } from 'memoize-one';
import {useLocation} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import TagSearchBar from "../../components/TagSearchBar";
import {Redirect} from 'react-router-dom';
import Rest from "../../Rest";
import CategorySelector from "../../components/CategorySelector";

import "./Search.css";

function SearchResults(props) {
    let search = Rest.searchObjects(props.category,props.tags);

    return <>
        <p style={{textAlign:"right", marginRight: "20px"}}>Results: {search.length}</p>
        {search.map(res=><SearchResult key={res._id} object={res}/>)}
    </>
}

function SearchResult(props) {
    return <a className="searchRes" href={props.object.file}>
        <img className="searchImg" alt="img" src={props.object.previewImage}/>
        <div>
            <p>Name: <b>{props.object.name}</b></p>
            <p>Size: {(Math.ceil(props.object.fileSize/1048576))+"MB"}</p>
            <div><p style={{display:"inline-block"}}>Tags: </p>{props.object.tags.map(t=><p className="tag" key={t._id}>{t.name}</p>)}</div>
        </div>
    </a>;
}

function updateValues(t,c,l) {
    console.log(c)
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
    let params = new URLSearchParams(location.search);

    let tags = JSON.parse(params.get('tags')) || [];
    let category = params.get('category');

    let [redirPath,updatePath] = useState(location.pathname+location.search)

    return (<>
        <Suspense fallback={<CircularProgress/>}>
            <div id="searchBar">
                <div id="selector">
                    <CategorySelector value={category} onChange={(e)=>{updatePath(updateValues(tags,e.target.value,location))}}/>
                </div>
                <div id="tags">
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