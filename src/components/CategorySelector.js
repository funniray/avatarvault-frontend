import Rest from "../Rest";
import React from "react";
import useFetch from "fetch-suspense";
import {TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

const CategorySelector = React.forwardRef((props,ref) => {
    let categories = useFetch(Rest.getCategories())

    return (
        <Autocomplete
            options={categories.map(c => c.name)}
            onChange={props.onChange}
            ref={ref}
            style={{width: 300}}
            freeSolo={props.freeSolo}
            autoSelect
            renderInput={(params) => <TextField {...params} label="Category" variant="outlined"/>}
        />
    );
});

export default CategorySelector;