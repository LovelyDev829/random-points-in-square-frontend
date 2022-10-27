import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import RegisterPage from './pages/RegisterPage'

function Routing() {
    const baseUrl = "http://localhost:4000";
    const [loginFlag, setLoginFlag] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [adminFlag, setAdminFlag] = useState(false)
    useEffect(()=>{
        if(userInfo.email === 'admin@gmail.com') setAdminFlag(true)
        else setAdminFlag(false)
    },[userInfo, adminFlag])
    // const loginFlag = props.loginFlag;
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path="/" element={<LoginPage
                    loginFlag={loginFlag} setLoginFlag={setLoginFlag} setUserInfo={setUserInfo} baseUrl={baseUrl}
                />} />
                <Route exact path="/login" element={<LoginPage
                    loginFlag={loginFlag} setLoginFlag={setLoginFlag} userInfo={userInfo} setUserInfo={setUserInfo} baseUrl={baseUrl}
                />} />
                <Route exact path="/register" element={<RegisterPage
                    setLoginFlag={setLoginFlag} baseUrl={baseUrl} setUserInfo={setUserInfo}
                />} />
                {loginFlag && <Route exact path="/main" element={<MainPage
                    loginFlag={loginFlag} setLoginFlag={setLoginFlag} userInfo={userInfo} setUserInfo={setUserInfo} baseUrl={baseUrl}
                    adminFlag={adminFlag}
                />} />}
            </Routes>
        </Router>
    )
}

export default Routing