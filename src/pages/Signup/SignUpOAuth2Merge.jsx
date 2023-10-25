import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { instance } from '../../api/config/instance';

function SignUpOAuth2Merge(props) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ mergeUser, setMergeUser ] = useState({
        email: searchParams.get("email"),
        password: "",
        oauth2Id: searchParams.get("oauth2Id"),
        provider: searchParams.get("provider")
    });

    const handleInputChange = (e) => {
        setMergeUser({
            ...mergeUser,
            [e.target.name]: e.target.value
        })
    }

    const handleMergeSubmitClick = async () => {
        try {
            await instance.put("/auth/oauth2/merge", mergeUser);
            alert("계정 통합이 완료되었습니다. 다시 로그인 해주세요");
            window.location.replace("auth/signin");
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <h1>{searchParams.get("email")} 계정과 {searchParams.get("provider")} 계정 통합</h1>
            <p>계정을 통합하시려면 가입된 사용자의 비밀번호를 입력하세요.</p>
            <div><input type="password" name="password" placeholder='비밀번호' onChange={handleInputChange} /></div>
            <button onClick={handleMergeSubmitClick}>확인</button>
        </div>
    );
}

export default SignUpOAuth2Merge;