import {Redirect} from 'react-router-dom';
import useFetch from "fetch-suspense";
import Rest from "../../Rest";
import {Chip, Grid, ListItem, ListItemText, Paper, Typography} from "@material-ui/core";
import List from "@material-ui/core/List";

function CategoryBlock(props) {
    let tags = useFetch(Rest.getTags("",1,3));

    console.log(tags)

    return(<Paper style={{height:100, width:500, margin:10}}>
        <Typography>{props.category}</Typography>
        <Grid container spacing={2}>
            {tags.map(t=><Chip style={{margin:5}} label={t.name}/>)}
        </Grid>
    </Paper>)
}

export default function Index() {
    let categories = useFetch(Rest.getCategories());
    let tags = useFetch(Rest.getTags("",1,0));
    return (<Grid container style={{height:"100%"}} direction={"row"}>
    <Grid item>
        <List style={{width:200,height:"100%",borderRight:"1px solid lightgray"}}>
            {categories.map(c=><ListItem button><ListItemText primary={c.name}/></ListItem>)}
        </List>
    </Grid>
    <Grid item>
        <List style={{width:200,height:"100%",borderRight:"1px solid lightgray"}}>
            {tags.map(t=><ListItem button><ListItemText primary={t.name}/></ListItem>)}
        </List>
    </Grid>
    </Grid>)
}