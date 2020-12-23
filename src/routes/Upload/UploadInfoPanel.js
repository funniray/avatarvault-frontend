import CircularProgress from "@material-ui/core/CircularProgress";
import CategorySelector from "../../components/CategorySelector";
import TagSearchBar from "../../components/TagSearchBar";
import React, {Suspense, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, Paper} from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
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
        dropZone: {
            width: '50%',
            height: '150px',
            marginTop:'10px',
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
            if (file.size > 1000000000){
                sorted[split.join(".")].exception = "Size is over 1GB!"
            }
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

const gridColumns =[
    {field:'fileName',headerName: 'File Name',width: 150,valueGetter:(props=>props.row.file.name)},
    {field:'previewName',headerName: 'Preview Name',width: 150,valueGetter:(props=>(props.row.preview || {name:"No Preview"}).name)},
    {field:'exception',headerName: 'Exceptions',width: 300},
];

export default function UploadInfoPanel(props) {
    let [category,setCategory] = useState('avatars');
    let [tags, setTags] = useState([]);
    let [files,setFiles] = useState([]);
    let [sorted, unsorted] = sortFiles(files);
    let [selected,setSelected] = useState([]);
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
        sorted[sort].id = sort;
        grid.push(sorted[sort]);
    }

    return (
        <Suspense fallback={<CircularProgress/>}>
            <Grid container spacing={2} style={{width:'100%', padding: 10}}>
                <Grid item container xs={2}>
                    <CategorySelector style={{width:'100%'}} ref={catRef} onChange={(e,v)=>setCategory(v)} freeSolo/>
                </Grid>
                <Grid item xs={10}>
                    <TagSearchBar style={{width:'100%'}} value={tags} freeSolo onChange={(e,v)=>{setTags(v)}}/>
                </Grid>
            </Grid>
            <p>Drop files below to upload.</p>
            <div onDragOver={e=>{e.stopPropagation();e.preventDefault()}} onDrop={e=>{setFiles(dropHandler(e,files))}}>
                {exceptions}
                <Grid direction={"column"} container>
                    <Grid item container style={{minHeight:500, width: '100%', margin:10 }}>
                        <DataGrid rows={grid} columns={gridColumns} checkboxSelection onSelectionChange={e=>setSelected(e.rowIds)} />
                    </Grid>
                    <Grid item container spacing={2} style={{width:"100%", margin:10}}>
                        <Grid item container xs justify={"flex-start"}>
                            <Button color={"secondary"} variant={"outlined"} onClick={()=>setFiles([])}>Clear</Button>
                        </Grid>
                        <Grid item container xs justify={"flex-end"}>
                            <Button color={"primary"} variant={"outlined"} onClick={()=>{
                                let toUpload = selected.map(i=>sorted[i]);
                                uploadAll(toUpload,category,tags,props.files,props.setUploadingFiles,props.password)
                            }}>Upload Selected Files</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Suspense>)
}