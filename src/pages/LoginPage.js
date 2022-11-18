import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EyeIcon } from "../assets/svgs/eye.svg";
import { ReactComponent as EyeOffIcon } from "../assets/svgs/eye-off.svg";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import { CRYPT_KEY, CLIENT_ID, BASE_URL } from '../utils/Constants'
import logo from '../assets/animation/Logo.gif';
import axios from 'axios';
const CryptoJS = require("crypto-js");

function LoginPage({ loginFlag, setLoginFlag, setUserInfo }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passHideFlag, setPassHideFlag] = useState(true)
    const navigate = useNavigate();
    const logIn = () => {
        var loginData = { email: email.toLowerCase(), password: password }
        var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(loginData), CRYPT_KEY).toString();
        axios.post(BASE_URL + '/user/check-user', { data: encryptedData })
            .then(res => {
                if (res.data) {
                    setUserInfo(res.data)
                    setLoginFlag(true)
                }
                else alert("Wrong Login Info...")
            })
            .catch((error) => {
                alert("Wrong Login Info..")
            })
    }
    useEffect(() => {
        if (loginFlag) navigate('/main');
    })
    const onLogin = (res) => {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.disconnect();
        console.log('Login Success 😍 : currentUser:', res.profileObj);
        refreshTokenSetup(res);
        var tempUserInfo = {
            firstName: res.profileObj.givenName,
            lastName: res.profileObj.familyName,
            userName: res.profileObj.name,
            email: res.profileObj.email
        }
        setUserInfo(tempUserInfo)
        setLoginFlag(true)
    };
    const onFailure = (res) => {
        console.log('Login failed 😢 : res:', res);
    };
    return (
        <div className='LoginPage'>
            <p className='top-title'>THE GOD PROJECT</p>
            <img src={logo}/>
            <p className='title'>Login</p>
            <div className='input-item'>
                <p>Email</p>
                <div className='input-box'>
                    <input type={"text"} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </div>
            </div>
            <div className='input-item'>
                <p>Password</p>
                <div className='input-box'>
                    <input type={passHideFlag ? "password" : "text"} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    <div className='hide-eye' onClick={() => setPassHideFlag(!passHideFlag)}>{passHideFlag ? <EyeIcon /> : <EyeOffIcon />}</div>
                </div>
            </div>
            <div className='button' onClick={() => logIn()} >LOGIN</div>

            <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={onLogin}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />

            <p className='forgot-password' onClick={() => navigate('/register')}><u>Register</u></p>
        </div>
    )
}

export default LoginPage