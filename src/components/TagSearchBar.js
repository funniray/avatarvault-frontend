import React from 'react';
import useFetch from "fetch-suspense";
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Rest from "../Rest";

export default function Tags(props) {
    let tags = useFetch(Rest.getTags("",1,0))

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={tags.map(tag=>tag.name)}
            //getOptionLabel={(option) => option.title}
            value={ props.value || [] }
            onChange={props.onChange}
            freeSolo={props.freeSolo}
            autoSelect
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Type Tag..."
                />
            )}
        />
    );
}