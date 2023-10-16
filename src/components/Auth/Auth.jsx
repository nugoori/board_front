import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from '../../pages/SignIn/Signin';
import SignUp from '../../pages/Signup/Signup';

function Auth(props) {
    return (
        <Routes >
            <Route path='signin' element={ <SignIn /> }/>
            <Route path='signup' element={ <SignUp /> }/>
        </Routes>
    );
}

export default Auth;