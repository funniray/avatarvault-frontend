import React from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Rest from "../Rest";

const filter = createFilterOptions();

export default class Tags extends React.Component {

    render() {
        let tags = Rest.getTags("",1,0)

        return (
            <Autocomplete
                multiple
                id="tags-outlined"
                options={tags.map(tag=>tag.name)}
                //getOptionLabel={(option) => option.title}
                value={ this.props.value || [] }
                onChange={this.props.onChange}
                freeSolo={this.props.freeSolo}
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
}