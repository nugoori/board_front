import React from 'react';
import { Navigate, Route, Routes} from 'react-router-dom';
import SignIn from '../../pages/SignIn/Signin';
import SignUp from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';
import SignUpOAuth2 from '../../pages/Signup/SignupOAuth2';

function AuthRoute(props) {

    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!!principalState?.data?.data) {
        return <Navigate to={"/"} />
    }

    return (
        <Routes >
            <Route path='signin' element={ <SignIn /> }/>
            <Route path='signup' element={ <SignUp /> }/>
            <Route path='oauth2/signup' element={ <SignUpOAuth2 /> }/>
        </Routes>
    );
}

export default AuthRoute;