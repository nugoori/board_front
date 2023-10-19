import React from 'react';
import { useQueryClient } from 'react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import Mypage from '../../pages/Mypage/Mypage';

function AccountRoute(props) {
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!principalState?.data?.data) {
        alert("로그인 후 이용이 가능합니다.")
        return <Navigate to={"/auth/signin"} />
    }

    return (
        <Routes >
            <Route path='mypage' element={ <Mypage /> }/>
            <Route path='password' element={ <></> } />
        </Routes>
    );
}

export default AccountRoute;