import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EyeIcon } from "../assets/eye.svg";
import { ReactComponent as EyeOffIcon } from "../assets/eye-off.svg";
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';

// const clientId = '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com'
const clientId = '316927714071-82f8g7ba69432r076iu34aq9o142633r.apps.googleusercontent.com'
// const clientSecret = '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'

function LoginPage({ loginFlag, setLoginFlag, setUserInfo, baseUrl }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passHideFlag, setPassHideFlag] = useState(true)
    const navigate = useNavigate();
    const logiN = () => {
        axios.post(baseUrl + '/user/check-user', { email: email.toLowerCase(), password: password })
            .then(res => {
                if (res.data[0]) {
                    setUserInfo(res.data[0])
                    setLoginFlag(true)
                }
                else alert("Wrong Login Info...")
            })
            .catch((error) => {
                alert("There was an error...")
            })
    }
    useEffect(() => {
        if (loginFlag) navigate('/main');
    })
    const onLogin = (res) => {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.disconnect();
        console.log('Login Success: currentUser:', res.profileObj);
        // alert(
        //     `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
        // );
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
        console.log('Login failed: res:', res);
        alert(
            `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
        );
    };
    return (
        <div className='LoginPage'>
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
            <div className='button' onClick={() => logiN()} >LOGIN</div>

            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onLogin}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />

            <p className='forgot-password' onClick={() => navigate('/register')}><u>Do you want to create a new user?</u></p>
        </div>
    )
}

export default LoginPage