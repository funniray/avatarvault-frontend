import memoizeOne from 'memoize-one';
import Rest from "../Rest";
import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

const memoizeCategories = memoizeOne(Rest.getCategories);

export default class CategorySelector extends React.Component {

    render() {
        let categories = memoizeCategories();

        return (
            <FormControl>
                <InputLabel>Category</InputLabel>
                <Select
                    //multiple
                    id="tags-outlined"
                    //getOptionLabel={(option) => option.title}
                    //defaultValue={[top100Films[13]]}
                    onChange={this.props.onChange}
                    value={this.props.value || categories[0].name}
                >
                    {categories.map(v=><MenuItem key={v._id} value={v.name}>{v.name}</MenuItem>)}
                </Select>
            </FormControl>
        );
    }
}