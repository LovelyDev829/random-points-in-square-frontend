import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({loginFlag, setLoginFlag, setUserInfo, baseUrl}) {
    const navigate = useNavigate();
    const logiN = () => {
        axios.post(baseUrl + '/user/check-user', { email: email, password: password })
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
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    useEffect(() => {
        if (loginFlag) navigate('/main');
    })
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
                    <input type={"password"} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </div>
            </div>
            <div className='button' onClick={()=>logiN()} >LOGIN</div>
            <p className='forgot-password' onClick={()=>navigate('/register')}><u>Do you want to create a new user?</u></p>
        </div>
    )
}

export default LoginPage