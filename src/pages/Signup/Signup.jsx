import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {instance} from '../../api/config/instance';

function SignUp(props) {

    const navigate = useNavigate();

    const user = {
        email: "",
        password: "",
        name: "",
        nickname: ""
    }

    const [ signUpUser, setSignUpUser ] = useState(user);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSignUpUser({
            ...signUpUser,
            [name]: value
        });
    }

    const handleSignInClick = () => {
        navigate("/auth/signin");
    }

    //? email -> 인증 -> 비밀번호를 찾을 때 새 비밀번호를 설정하도록
    const handleSignUpSubmit = async () => {
        try {
            const response = await instance.post("/auth/signup", signUpUser);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div><input type="email" name='email' placeholder='이메일을 입력해주세요.' onChange={handleInputChange} /></div>
            <div><input type="password" name='password' placeholder='비밀번호를 입력해주세요' onChange={handleInputChange} /></div>
            <div><input type="text" name='name' placeholder='이름' onChange={handleInputChange} /></div>
            <div><input type="text" name='nickname' placeholder='닉네임' onChange={handleInputChange} /></div>
            <div><button onClick={handleSignUpSubmit}>가입하기</button></div>
            <div><button onClick={handleSignInClick}>로그인하러 가기</button></div>
        </div>
    );
}

export default SignUp;