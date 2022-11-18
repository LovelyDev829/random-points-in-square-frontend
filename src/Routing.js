import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HelpPage from './pages/HelpPage'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import RegisterPage from './pages/RegisterPage'

function Routing() {
    const [loginFlag, setLoginFlag] = useState(localStorage.getItem('god-loginFlag'))
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('god-userInfo')))
    const [adminFlag, setAdminFlag] = useState(localStorage.getItem('god-adminFlag'))
    useEffect(() => {
        if (userInfo?.email === 'admin@gmail.com') setAdminFlag(true)
        else setAdminFlag(false)
    }, [userInfo, adminFlag])
    useEffect(()=>{
        localStorage.setItem('god-loginFlag', loginFlag)
    },[loginFlag]);
    useEffect(()=>{
        localStorage.setItem('god-userInfo', JSON.stringify(userInfo))
    },[userInfo]);
    useEffect(()=>{
        localStorage.setItem('god-adminFlag', adminFlag)
    },[adminFlag]);
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path="/" element={<LoginPage
                    loginFlag={loginFlag} setLoginFlag={setLoginFlag} setUserInfo={setUserInfo}
                />} />
                <Route exact path="/login" element={<LoginPage
                    loginFlag={loginFlag} setLoginFlag={setLoginFlag} userInfo={userInfo} setUserInfo={setUserInfo}
                />} />
                <Route exact path="/register" element={<RegisterPage
                    setLoginFlag={setLoginFlag} setUserInfo={setUserInfo}
                />} />
                {loginFlag && <Route exact path="/main" element={<MainPage
                    loginFlag={loginFlag} setLoginFlag={setLoginFlag} userInfo={userInfo} setUserInfo={setUserInfo}
                    adminFlag={adminFlag}
                />} />}
                {loginFlag && <Route exact path="/help" element={<HelpPage />} />}
            </Routes>
        </Router>
    )
}

export default Routing