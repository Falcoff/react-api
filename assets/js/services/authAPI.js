import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { LOGINS_API } from './config'

function authenticate(credentials){
    return axios.
            post(LOGINS_API, credentials)
            .then(response => response.data.token)
            .then(token => {
                window.localStorage.setItem("authToken", token)
                axios.defaults.headers["Authorization"] = "Bearer " + token;
            })
}

function logout(){
    window.localStorage.removeItem("authToken")
    delete axios.defaults.headers["Authorization"]
}

function setup(){
    const token = window.localStorage.getItem("authToken");
    if(token){
        const jwtData= jwtDecode(token)
        if(jwtData.exp*1000 > new Date().getTime()){
            axios.defaults.headers["Authorization"] = "Bearer " + token;
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime()) {
            return true
        }
        return false
    }
    return false
}

export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
}