import CircularProgress from "@material-ui/core/CircularProgress";
import CategorySelector from "../../components/CategorySelector";
import TagSearchBar from "../../components/TagSearchBar";
import React, {Suspense, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import axios from 'axios';
import {baseurl} from "../../Rest";

let queue = [];
let isQueueRunning = false;

let fileTypes = {
    files: ['rar','zip','7z','unitypackage','exe','gz','vrca','shader','msi'],
    previews: ['png','jpg','jpeg','gif']
}

const useStyles = makeStyles((theme) =>{
    //Why didn't they just use a palette thing?
    const borderColor = theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';
    return{
        catSelector: {
            width: 'calc(20% - 80px)',
            display: 'inline-flex',
            alignItems: 'middle',
            margin: "10px 10px 10px 20px"
        },
        tagSelector: {
            width: '70%',
            display: 'inline-block',
            margin: "10px 20px 10px 10px"
        },
        dropZone: {
            width: '50%',
            height: '10vh',
            border: '1px solid '+borderColor,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        border: {
            border: "1px solid "+borderColor
        }
    }
});

function dropHandler(e,currentFiles) {
    console.log('got files')
    e.preventDefault();

    let files = [...currentFiles]

    if (e.dataTransfer.items) {
        for (let item of e.dataTransfer.items) {
            if (item.kind === 'file') {
                files.push(item.getAsFile());
            }
        }
    } else {
        e.dataTransfer.files.forEach(item=>files.push(item));
    }

    return files;
}

function sortFiles(files) {
    let sorted = {};

    files = files.filter(file=>{
        let split = file.name.split('.');
        if (fileTypes.files.includes(split[split.length-1].toLowerCase())){
            split.pop();
            sorted[split.join(".")] = {file: file};
            return false;
        }
        return true;
    });

    files = files.filter(file=>{
        let split = file.name.split('.');
        if (fileTypes.previews.includes(split[split.length-1].toLowerCase())){
            split.pop();
            if (!sorted[split.join(".")]) return true;
            sorted[split.join(".")].preview = file;
            return false;
        }
        return true;
    });

    return [sorted,files];
}

class ObjectUpload {
    formData;
    listeners = [];
    finishedListener=[];
    upload;
    name;
    finished = false;
    downloading = false;
    progress = 0;

    constructor(file,preview,tags,category,password) {
        this.name=file.name;
        this.formData = new FormData();
        this.formData.append('file',file);
        this.formData.append('tags',JSON.stringify(tags));
        this.formData.append('category',category);
        this.formData.append('password',password)
        if (preview) this.formData.append('preview',preview);
    }

    addEventListener(listener) {
        listener({loaded:this.progress,total:100});
        this.listeners.push(listener);
    }

    addFinishedListener(listener) {
        this.finishedListener.push(listener)
    }

    callListeners(e){
        this.progress = Math.round((100 * e.loaded) / e.total);
        this.listeners.forEach((l)=>l(e))
    }

    uploadFile() {
        this.downloading = true;
        let a = axios.create({baseURL:baseurl});
        this.upload = a.post(`/v1/upload`,this.formData, {headers:{"Content-Type": "multipart/form-data"}, onUploadProgress: (e)=> this.callListeners(e)});
        this.upload.then(this.finishedListener.forEach(l=>l()));
        return this.upload;
    }
}

function upload(c,t,files,p) {
    return new ObjectUpload(files.file,files.preview,t,c,p)
}

function uploadAll(files,c,t,uploading,setFiles,p) {
    for (let fileName in files) {
        let file = files[fileName];
        const u = upload(c,t,file,p);
        uploading.push(u);
        queue.push(u);
    }
    setFiles(uploading);

    if (!isQueueRunning) {
        isQueueRunning = true;
        for (let i=0;i<3;i++) {
            doNextInQueue();
        }
    }
}

async function doNextInQueue() {
    if (!queue[0]) {
        isQueueRunning = false;
        console.log(queue);
        return;
    }
    let file = queue[0];
    queue.shift();
    await file.uploadFile();
    await doNextInQueue();
}

export default function UploadInfoPanel(props) {
    let [category,setCategory] = useState('avatars');
    let [tags, setTags] = useState([]);
    let [files,setFiles] = useState([]);
    let [sorted, unsorted] = sortFiles(files);
    let catRef = useRef()
    const classes = useStyles();

    let exceptions;
    let grid = [];

    if (unsorted.length > 0) {
        exceptions = <div><p>Some files have exceptions!</p>{unsorted.map(f=><p key={f.name}>{f.name}</p>)}</div>
    } else {
        exceptions = <></>
    }

    for (let sort in sorted) {
        grid.push(<tr className={classes.border} key={sort}>
            <td className={classes.border}>{sorted[sort].file.name}</td>
            <td className={classes.border}>{(sorted[sort].preview || {name:"no preview"}).name}</td>
        </tr>)// <td className={classes.border}><Button onClick={()=>upload(category,tags,sorted[sort]).uploadFile()}>Upload</Button></td>
    }

    return (
        <Suspense fallback={<CircularProgress/>}>
            <div className={classes.catSelector}><CategorySelector ref={catRef} onChange={(e,v)=>setCategory(v)} freeSolo/></div>
            <div className={classes.tagSelector}><TagSearchBar value={tags} freeSolo onChange={(e,v)=>{setTags(v)}}/></div>
            <div className={classes.dropZone} onDragOver={e=>{e.stopPropagation();e.preventDefault()}} onDrop={e=>setFiles(dropHandler(e,files))}>
                Drop files here...
            </div>
            <div>
                {exceptions}
                <br/>
                <br/>
                <br/>
                <p>These files will be uploaded...</p>
                <table className={classes.border} style={{margin:"auto"}}>
                    <thead>
                        <tr className={classes.border}>
                            <th className={classes.border}>File</th>
                            <th className={classes.border}>Preview</th>
                        </tr>
                    </thead>
                    <tbody>{grid}</tbody>
                </table>
                <Button onClick={()=>setFiles([])}>Clear</Button>
                <Button onClick={()=>uploadAll(sorted,category,tags,props.files,props.setUploadingFiles,props.password)}>Upload All Files</Button>
            </div>
        </Suspense>)
}