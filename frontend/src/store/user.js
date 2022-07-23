import SecureLS from "secure-ls"

const LOGGED_IN_USER = "./user/LOGGED_IN_USER"
const REMOVE_USER = "./user/REMOVE_USER"

let apiPrefix_v1 = process.env.REACT_APP_API
if(process.env.REACT_APP_ENVIRONMENT === 'localhost'){
    apiPrefix_v1 = 'http://localhost:5000/api/v1'
}

const updateLoggedInUser = (user) => ({
    type: LOGGED_IN_USER,
    user
})

const removeUser = () => ({
    type:REMOVE_USER,
})

export const storeTokens = ({accessToken, refreshToken}) => async(dispatch) => {
    const ls = new SecureLS({encodingType: 'aes', encryptionSecret: `${process.env.REACT_APP_CREATE_CRYPTO_KEY}`})
    if(accessToken)
    if(accessToken != null ){
        ls.set('access_token', accessToken)
    }
    if(refreshToken != null ){
        ls.set('refresh_token', refreshToken)
    }
    const getToken = ls.get('access_token')
    return
}

export const getStoredTokens = () => async(dispatch) => {
    const ls = new SecureLS({encodingType: 'aes', encryptionSecret: `${process.env.REACT_APP_CREATE_CRYPTO_KEY}`})
    try{
        const storedAccessToken = await ls.get('access_token')
        const storedRefreshToken = await ls.get('refresh_token')
        return {accessToken: storedAccessToken, refreshToken: storedRefreshToken}
    }catch(e){
        return {accessToken: null, refreshToken: null}
    }
}



//* GET NEW ACCESS TOKEN WITH REFRESH TOKEN
export const generateNewAccessToken = () => async(dispatch) =>{
    const tokens = await dispatch(getStoredTokens())
    //* A Refresh Token needs to exist to generate a new access token 
    if(tokens.refreshToken == null){
        return 
    }
    const res = await fetch(`${apiPrefix_v1}/auth/token`, {
        method:"POST",
        headers:{"Content-Type":'application/json'},
        body:JSON.stringify({token:tokens.refreshToken})
    })
    const tokens_res = await res.json()
    
    if(res.status > 399){
        return tokens_res
    }
    await dispatch(storeTokens({accessToken: tokens_res.accessToken}))
    await dispatch(updateLoggedInUser(tokens_res.user))

    return 
}

//* RESTORE USER WITH TOKEN
export const restoreUser = () => async(dispatch) =>{
    const tokens = await dispatch(getStoredTokens())
    if(tokens.accessToken == null || tokens.accessToken === "" ){
        return 
    }
    //* Validate Access Token
    const res = await fetch(`${apiPrefix_v1}/auth/login`, {
        method:"POST",
        headers:{"Content-Type":'application/json', Authorization:`Bearer ${tokens.accessToken}`},
    })
    
    
    if(res.status === 403 && tokens.refreshToken != null){
        //* Obtain new access token and refresh token if access token is expired
        await dispatch(generateNewAccessToken())
        return
    }

    const tokens_res = await res.json()
    await dispatch(updateLoggedInUser(tokens_res.user))
    return 
}

//* USER LOGOUT
export const logoutUser = (payload) => async(dispatch) => {
    const tokens = await dispatch(getStoredTokens())
    await fetch(`${apiPrefix_v1}/users/logout`,{
        method:"DELETE",
        headers:{"Content-Type":"application/json", Authorization:`Bearer ${tokens.accessToken}`},
        body: JSON.stringify(payload)
    })
    await dispatch(removeUser())
    const ls = new SecureLS()
    ls.removeAll()
}

//* USERNAME PASSWORD LOGIN
//? payload = {credential, password}
export const userLogin = (payload) => async(dispatch) => {
    const res = await fetch(`${apiPrefix_v1}/users/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    })
    const userLogin_res = await res.json()
    if(res.status > 399){
        return userLogin_res
    }
    await dispatch(storeTokens({accessToken: userLogin_res?.accessToken, refreshToken: userLogin_res?.refreshToken}))
    await dispatch(updateLoggedInUser(userLogin_res.loggedInUser))
    return userLogin_res
}

//* CREATE NEW USER
export const createUser = (payload) => async(dispatch) => {
    const res = await fetch(`${apiPrefix_v1}/users/sign-up`,{
        method:"POST",
        headers:{"Content-Type":'application/json'},
        body:JSON.stringify(payload)
    })
    const createUser_res = await res.json()
    if(res.status > 399 ){
        return createUser_res
    }
    const accessTokenRes = createUser_res?.accessToken
    const refreshTokenRes = createUser_res?.refreshToken
    const newUser = createUser_res?.loggedInUser
    await dispatch(storeTokens({accessToken: accessTokenRes, refreshToken: refreshTokenRes}))
    await dispatch(updateLoggedInUser(newUser))
    return createUser_res
}

export const testfx = () => async(dispatch) => {
    const tokens = await dispatch(getStoredTokens())

    const res = await fetch(`${apiPrefix_v1}/test/ping`,{
        headers:{"Content-Type":'application/json', Authorization:`Bearer ${tokens.accessToken}`},
    })
    if(res.status === 403){
        await restoreUser()
        return 
    }
}



const initialState = {
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGGED_IN_USER: {
            return {
                ...state,
                ...action.user
            }
        }
        case REMOVE_USER: {
            return{
                
            }
        }
        default:
            return state;
    }
}

export default userReducer