import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EyeIcon } from "../assets/svgs/eye.svg";
import { ReactComponent as EyeOffIcon } from "../assets/svgs/eye-off.svg";
import {CRYPT_KEY, BASE_URL} from '../utils/Constants'
import axios from 'axios';
const CryptoJS = require("crypto-js");

function RegisterPage({setUserInfo, setLoginFlag}) {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passHideFlag, setPassHideFlag] = useState(true)
    return (
        <div className='RegisterPage'>
            <div className='main'>
                <p className='title'>Create a new user</p>
                <div className='input-item'>
                    <p>First Name</p>
                    <div className='input-box'>
                        <input type={"text"} value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                    </div>
                </div>
                <div className='input-item'>
                    <p>Last Name</p>
                    <div className='input-box'>
                        <input type={"text"} value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                    </div>
                </div>
                <div className='input-item'>
                    <p>User Name</p>
                    <div className='input-box'>
                        <input type={"text"} value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                    </div>
                </div>
                <div className='input-item'>
                    <p>Email</p>
                    <div className='input-box'>
                        <input type={"email"} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                </div>
                <div className='input-item'>
                    <p>Password</p>
                    <div className='input-box'>
                        <input type={passHideFlag?"password":"text"} value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <div className='hide-eye' onClick={()=>setPassHideFlag(!passHideFlag)}>{ passHideFlag?<EyeIcon/>:<EyeOffIcon/> }</div>
                    </div>
                </div>
                <div className='button' onClick={() => {
                    if (firstName !== '' && lastName !== '' && userName !== '' && email !== '' && password !== '') {

                        const userObject = {
                            firstName: firstName,
                            lastName: lastName,
                            userName: userName,
                            email: email.toLowerCase(),
                            password: CryptoJS.AES.encrypt(JSON.stringify(password), CRYPT_KEY).toString()
                        };
                        var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userObject), CRYPT_KEY).toString();
                        axios.post(BASE_URL + '/user/create-user', {data: encryptedData})
                            .then(res => {
                                if (res.data?.success) {
                                    setUserInfo(res.data?.data)
                                    setLoginFlag(true)
                                    navigate('/main')
                                }
                                else if(!res.data?.success){
                                    alert(res.data?.message)
                                }
                                else{
                                    alert("There was an error...")
                                }
                            })
                            .catch((error) => { alert("There was an error...") });
                    }
                }}>CREATE A NEW USER</div>
                <p className='forgot-password' onClick={()=>navigate('/login')}><u>Already have got a login info?</u></p>
            </div>
        </div>
    )
}

export default RegisterPage