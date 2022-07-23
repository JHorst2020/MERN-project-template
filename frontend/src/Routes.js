import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { restoreUser } from "./store/user";

//? PAGES
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signUp";

const AppRoutes = () => {

    const dispatch = useDispatch()
    const loggedInUser = useSelector(state => state.user)
    const [isLoaded, setIsLoaded] = useState(false)
    const initialLoad = async() => {
        try{
            await dispatch(restoreUser())
            setIsLoaded(true)
        }catch(e){
            setIsLoaded(true)
        }
        
    }
    useEffect(()=>{
        initialLoad()
    },[])


    return(
        <>
            { isLoaded &&
            (<BrowserRouter>
                <Switch>
                    {
                        loggedInUser?._id ? 
                        <Route path="/sign-up" component={SignUpPage} />
                        :
                        <Route path="/sign-up" component={LoginPage} />
                    }
                    {
                        loggedInUser?._id ? 
                        <Route path="/" component={HomePage} />
                        :
                        <Route path="/" component={LoginPage} />
                    }
                </Switch>
            </BrowserRouter>)
            }
        </>

    )
}

export default AppRoutes 