import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'

function Routing() {
    const loginFlag = useSelector(state => state.loginFlag);
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/login" element={<LoginPage />} />
                {loginFlag && <Route exact path="/main" element={<MainPage />} />}
            </Routes>
        </Router>
    )
}

export default Routing