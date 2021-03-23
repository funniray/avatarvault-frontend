import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, FormControl, FormHelperText, Grid, Input, InputLabel} from "@material-ui/core";
import {useDispatch, useSelector} from 'react-redux';
import Rest from '../../Rest';
import {Alert} from "@material-ui/lab";
import {setLogin} from "../../redux_features/loginSlice";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    button: {
        marginTop: 10,
    }
});

async function loginUser(event,dispatch,error) {
    console.log(event.target.email.value)
    event.preventDefault();

    if (event.target.password.value !== event.target[`password-confirm`].value) {
        error("The passwords do not match")
        return;
    }

    event.target.submitButton.disabled = true;

    let loginRes = await fetch(Rest.register(), {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value
        })
    })

    let loginJson = await loginRes.json();

    event.target.submitButton.disabled = false;

    console.log(loginJson)
    if (loginRes.status>=400) {
        error(loginJson.error);
        return;
    } else {
        //Clear the error message
        error("");
    }

    dispatch(setLogin(loginJson))
}

export default function RegisterPanel(props) {
    const styles = useStyles();
    const dispatch = useDispatch()
    const [errorState, setErrorState] = useState("");
    let error = <React.Fragment/>;

    console.log(errorState);
    if (errorState) {
        error = <Alert item severity="error">{errorState}</Alert>

    }

    return <div className={styles.root}>
        <form onSubmit={event => loginUser(event,dispatch,setErrorState)}>
            <Grid container spacing={2} direction={"column"}>
                {error}
                <FormControl item>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input id="username" aria-describedby="username-helper-text" />
                    <FormHelperText id="username-helper-text">Pick something you'll remember</FormHelperText>
                </FormControl>
                <FormControl item>
                    <InputLabel htmlFor="email">Email address</InputLabel>
                    <Input id="email" aria-describedby="email-helper-text" />
                    <FormHelperText id="email-helper-text">We'll never share your email.</FormHelperText>
                </FormControl>
                <FormControl item>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input type={"password"} id="password" />
                </FormControl>
                <FormControl item>
                    <InputLabel htmlFor="password-confirm">Confirm Password</InputLabel>
                    <Input type={"password"} id="password-confirm" />
                </FormControl>
                <Grid item container xs direction={"row-reverse"} className={styles.button}>
                    <Button id={"submitButton"} type={"submit"} color={"primary"} variant={"contained"}>Register</Button>
                </Grid>
            </Grid>
        </form>
    </div>
}