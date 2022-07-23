import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useLocation, useHistory} from "react-router-dom"

//? MATERIAL UI
import { Paper, Button, Grid, Typography, Collapse, TextField, Dialog, Checkbox, FormControlLabel, Select, MenuItem, Popover, List, ListItemButton, ListItemIcon, Box, Icon, SvgIcon, Backdrop, CircularProgress, FormControl} from "@mui/material";

//? REDUX STORE
import {
    createUser
} from "../store/user"

const SignUpPage = () => {

    const dispatch = useDispatch()
    const history = useHistory()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pwComplexity, setpwComplexity] = useState(false)
    const [num, setNum] = useState(false)
    const [char, setChar] = useState(false)
    const [len, setLen] = useState(false)
    const [error, setError] = useState({})
    const [errorMessage, setErrorMessage] = useState({})

    const handleUsername = async(input) => {
        const removeSpaces = input.replace(/\s/g, '')
        setUsername(removeSpaces)
    }

    const emailCheck = async(input) => {
        setEmail(input)
        //TODO check if email is already in use
        const emailRegex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if(emailRegex.test(input) == false){
            //* return true to indicate an invalid email
            return true
        }
        if(emailRegex.test(input) == true){
            //* return false to indicate a valid email
            return false
        }
    }

    const pwCheck = async(input) => {
        const removeSpaces = input.replace(/\s/g, '')
        const pwStrength = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/i
        const numCheck = /(?=.*[0-9])/i
        const charCheck = /(?=.*[!@#$%^&*])/i
        const lenCheck = input.length
        setNum(numCheck.test(input))
        setChar(charCheck.test(input))
        setLen(lenCheck > 6)
        setpwComplexity(pwStrength.test(removeSpaces))
        setPassword(removeSpaces)
    }

    const errorCheck = async() => {
        const errorObj = {}
        if(pwComplexity === false || num === false || char === false || len === false){
            errorObj.password = true
        }
        const invalidEmail = await emailCheck(email)
        if(invalidEmail){
            errorObj.email = true
        }
        if(username.length < 4){
            errorObj.username = true
        }
        setError(errorObj)
        if(Object.keys(errorObj).length > 0){
            return true
        }
        if(Object.keys(errorObj).length === 0){
            return false
        }
    }

    const handleSubmit = async() => {
        setError({})
        setErrorMessage({})
        const errorsInSubmission = errorCheck()
        if(errorsInSubmission === true){
            return
        }
        const payload = {
            username,
            email,
            password
        }
        const createNewUser = await dispatch(createUser(payload))
        const errorMessageObj = {}
        if(createNewUser?.username?.error != null){
            errorMessageObj.username = createNewUser.username.errorMessage
        }
        if(createNewUser?.email?.error != null){
            errorMessageObj.email = createNewUser.email.errorMessage
        }
        setErrorMessage(errorMessageObj)
        if(Object.keys(errorMessageObj).length === 0){
            history.push("/")
        }
        return
    }

    const handleLoginHereClick = () => {
        history.push("/")
    }


    return(
        <Grid container item xs={12} sx={{height:"100vh", background:'linear-gradient(to right bottom, #36EAEF, #6B0AC9)'}} justifyContent='center' alignItems='center'>
            <Grid item xs="auto">
                <Box sx={{height:500, width:500, background:"#F5F5F5"}}>
                    <Grid container justifyContent='center' alignItems='center' sx={{p:2}}>
                        <FormControl>
                            <Grid container item xs={12} justifyContent='center' >
                                <Grid item xs={"auto"}>
                                    <Typography variant='h6'>Sign Up</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{pt:2}}>
                                    <TextField type='email' value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth id="email" label="Email" error={error?.email} helperText={errorMessage?.email} />
                                </Grid>
                                <Grid item xs={12} sx={{pt:2}}>
                                    <TextField value={username} onChange={(e)=>handleUsername(e.target.value)} fullWidth id="username" label="Username" error={error?.username} helperText={errorMessage?.username} />
                                </Grid>
                                <Grid item xs={12} sx={{pt:2}}>
                                    <TextField type='password'  value={password} onChange={(e)=>pwCheck(e.target.value)} fullWidth id="password" label="Password" error={error?.password} />
                                </Grid>
                                {
                                    password.length > 0 ?
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant='body2' sx={{color: num ? "green" : "red"}}>At least 1 number</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='body2' sx={{color: char ? "green" : "red"}}>At least 1 special character</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant='body2' sx={{color: len ? "green" : "red"}}>At least 6 characters long</Typography>
                                        </Grid>
                                    </>
                                    : null
                                }
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
                                <Typography>Already have an account?</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} justifyContent='center'>
                            <Grid container item xs={"auto"}>
                                <Button onClick={handleLoginHereClick}>Login Here</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    )
}

export default SignUpPage