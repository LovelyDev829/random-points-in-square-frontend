import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HelpPage from './pages/HelpPage'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import RegisterPage from './pages/RegisterPage'

function Routing() {
    // const baseUrl = "https://random-points-in-square-back.herokuapp.com";
    const baseUrl = "http://localhost:4000";
    const [loginFlag, setLoginFlag] = useState(localStorage.getItem('loginFlag'))
    const [userInfo, setUserInfo] = useState(localStorage.getItem('userInfo'))
    const [adminFlag, setAdminFlag] = useState(localStorage.getItem('adminFlag'))
    useEffect(() => {
        if (userInfo?.email === 'admin@gmail.com') setAdminFlag(true)
        else setAdminFlag(false)
    }, [userInfo, adminFlag])
    useEffect(()=>{
        localStorage.setItem('loginFlag', loginFlag)
    },[loginFlag]);
    useEffect(()=>{
        localStorage.setItem('userInfo', userInfo)
    },[userInfo]);
    useEffect(()=>{
        localStorage.setItem('adminFlag', adminFlag)
    },[adminFlag]);
    useEffect(()=>{
        localStorage.setItem('loginFlag', false)
        localStorage.setItem('userInfo', {})
        localStorage.setItem('adminFlag', false)
    },[])
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
                {loginFlag && <Route exact path="/help" element={<HelpPage />} />}
            </Routes>
        </Router>
    )
}

export default Routing