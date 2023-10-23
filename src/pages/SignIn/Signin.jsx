import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/config/instance';

function SignIn(props) {

    const navigate = useNavigate();

    const user = {
        email: "",
        password: ""
    }

    const [ signinUser, setSigninUser ] = useState(user);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setSigninUser({
            ...signinUser,
            [name]: value
        })
    }

    const handleLoginButtonClick = async () => {
        try {
            const response = await instance.post("/auth/signin", signinUser);
            localStorage.setItem("accessToken", "Bearer " + response.data);
            window.location.replace("/");
            
        } catch (error) {
            if(error.response.status == 401) {
                alert(error.response.data.authError);
            } 
        }

    }

    const handleSignUpButtonClick = () => {
        navigate("/auth/signup");
    }

    const handleKakaoLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao" // back의 provider와 연결?
    }

    const handleNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    }

    return (
        <div>
            <div>
                <input type="email" name="email" placeholder='이메일' onChange={handleInputChange} />
                <input type="password" name="password" placeholder='비밀번호' onChange={handleInputChange} />
                <button onClick={handleLoginButtonClick}>로그인</button>
                <button onClick={handleSignUpButtonClick}>회원가입하러 가기</button>
                <div><button onClick={handleKakaoLogin}>카카오 로그인</button></div>
                <div><button onClick={handleNaverLogin}>네이버 로그인</button></div>
            </div>
        </div>
    );
}

export default SignIn;