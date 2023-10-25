import React from 'react';
import { Navigate, Route, Routes} from 'react-router-dom';
import SignIn from '../../pages/SignIn/Signin';
import SignUp from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';
import SignUpOAuth2 from '../../pages/Signup/SignupOAuth2';
import SignUpOAuth2Merge from '../../pages/Signup/SignUpOAuth2Merge';
import SigninOauth2 from '../../pages/SignIn/SigninOauth2';

function AuthRoute(props) {

    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!!principalState?.data?.data) {
        return <Navigate to={"/"} />
    }

    return (
        <Routes >
            <Route path='signin' element={ <SignIn /> }/>
            <Route path='oauth2/login' element={ <SigninOauth2 /> }/>
            <Route path='signup' element={ <SignUp /> }/>
            <Route path='oauth2/signup' element={ <SignUpOAuth2 /> }/>
            <Route path='oauth2/signup/merge' element={ <SignUpOAuth2Merge /> }/>
        </Routes>
    );
}

export default AuthRoute;