import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useLocation, useHistory} from "react-router-dom"

//? MATERIAL UI
import { Paper, Button, Grid, Typography, Collapse, TextField, Dialog, Checkbox, FormControlLabel, Select, MenuItem, Popover, List, ListItemButton, ListItemIcon, Box, Icon, SvgIcon, Backdrop, CircularProgress, FormControl} from "@mui/material";

//? REDUX STORE
import {
    testfx,
    logoutUser
} from "../../store/user"

const HomeComponent = () => {

    const dispatch = useDispatch()
    const loggedInUser = useSelector(state => state.user)

    const initialLoad = async() => {
        await dispatch(testfx())
    }

    useEffect(()=>{
        initialLoad()
    },[])

    const handleLogout = async() => {
        await dispatch(logoutUser({_id: loggedInUser._id}))
    }

    return(
        <Grid container>
            <Grid item xs={12}>
                <h5>Home Componenet</h5>
                <Typography>Home Component</Typography>
                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </Grid>
        </Grid>
    )
}

export default HomeComponent