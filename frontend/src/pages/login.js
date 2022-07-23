import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useLocation, useHistory} from "react-router-dom"

//? COMPONENTS
import HomeComponent from "../components/Home"

//? MATERIAL UI
import { Paper, Button, Grid, Typography, Collapse, TextField, Dialog, Checkbox, FormControlLabel, Select, MenuItem, Popover, List, ListItemButton, ListItemIcon, Box, Icon, SvgIcon, Backdrop, CircularProgress, FormControl} from "@mui/material";

//? REDUX STORE
import {
    userLogin
} from "../store/user"

const LoginPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState({})
    const [errorMessage, setErrorMessage] = useState({})

    const handleSubmit = async() => {
        const loginUser = await dispatch(userLogin({credential:credential, password:password}))
    }

    const handleSignUpHereClick = async() => {
        history.push("/sign-up")
    }

    return (
        <Grid container item xs={12} justifyContent="center" alignItems="center" sx={{height:"100vh", background:'linear-gradient(to right bottom, #36EAEF, #6B0AC9)'}} >
            <Box sx={{height:500, width:500, background:"#F5F5F5"}}>
                <Grid container justifyContent='center' alignItems='center' sx={{p:2}}>
                    <FormControl>
                        <Grid container item xs={12} justifyContent='center' >
                            <Grid item xs={"auto"}>
                                <Typography variant='h6'>Welcome Back!</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{pt:2}}>
                                <TextField value={credential} onChange={(e)=>setCredential(e.target.value)} fullWidth id="username" label="Username or Email" error={error?.credential} helperText={errorMessage?.credential} />
                            </Grid>
                            <Grid item xs={12} sx={{pt:2}}>
                                <TextField type='password'  value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth id="password" label="Password" error={error?.password} />
                            </Grid>
                            <Grid container item xs={12} justifyContent='center' sx={{pt:4}}>
                                <Grid item xs="auto">
                                    <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Grid>
                <Grid container item xs={12} sx={{pt:4}}>
                    <Grid container item xs={12} justifyContent='center'>
                        <Grid container item xs={"auto"}>
                            <Typography>Need an account?</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} justifyContent='center'>
                        <Grid container item xs={"auto"}>
                            <Button onClick={handleSignUpHereClick}>Sign Up Here</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )

}

export default LoginPage