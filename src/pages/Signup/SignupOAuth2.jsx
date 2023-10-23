import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {instance} from '../../api/config/instance';
import { useEffect } from 'react';

function SignUpOAuth2(props) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ element, setElement ] = useState(<></>);

    const navigate = useNavigate();

    useEffect(() => {
        if(!window.confirm("등록되지 않은 간편로그인 사용자입니다. 회원등록 하시겠습니까?")) {
            window.location.replace("/auth/signin");
        }
    }, [])

    const user = {
        email: "",
        password: "",
        name: searchParams.get("name"),
        nickname: "",
        oauth2Id: searchParams.get("oauth2Id"),
        profileImg: searchParams.get("profileImg"),
        provider: searchParams.get("provider")
    }

    const [ signUpUser, setSignUpUser ] = useState(user);

    const handleInputChange = (e) => {

        setSignUpUser({
            ...signUpUser,
            [e.target.name]: e.target.value
        });
    }

    const handleSignInClick = () => {
        navigate("/auth/signin");
    }

    //? email -> 인증 -> 비밀번호를 찾을 때 새 비밀번호를 설정하도록
    const handleSignUpSubmit = async () => {
        try {
            await instance.post("/oauth2/signup", signUpUser);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div><input type="email" name='email' placeholder='이메일.' onChange={handleInputChange} /></div>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange} /></div>
            <div><input type="text" name='name' placeholder='이름' disabled={true} value={signUpUser.name} /></div>
            <div><input type="text" name='nickname' placeholder='닉네임' onChange={handleInputChange} /></div>
            <div><button onClick={handleSignUpSubmit}>가입하기</button></div>
            <div><button onClick={handleSignInClick}>로그인하러 가기</button></div>
        </div>
    );
}

export default SignUpOAuth2;