import React, { useEffect, useRef, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { css } from "@emotion/react"
/** @jsxImportSource @emotion/react */
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../api/firebase/firebase";
import { Line } from 'rc-progress';
import { Link, useNavigate } from 'react-router-dom';

const infoHeader = css`
    display: flex;
    align-items: center;
    margin: 10px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
`;

const imgBox = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;

    & > img {
        width: 100%;
    }
`;

const file = css`
    display: none;
`;

function Mypage(props) {

    const navigate = useNavigate();
    const queryClinet = useQueryClient();
    const principalState = queryClinet.getQueryState("getPrincipal");
    const principal = principalState.data.data;
    const profileFileRef = useRef();
    
    const [ uploadFiles, setUploadFiles ] = useState([]);
    const [ profileImgSrc, setProfileImgSrc ] = useState("");
    const [ progressPercent , setProgressPercent ] = useState(0);

    useEffect(()=> {
        setProfileImgSrc(principal.profileUrl);
    }, []) 

    const handleSendMail = async () => {

        try {
            const option = {
                headers: {
                    "Authorization" : localStorage.getItem("accessToken")
                }
            }
            await instance.post("/account/mail/auth", {}, option);
            alert("인증 메일 발송 완료. 인증 요청 메일을 확인해주세요");
        } catch (error) {
            alert("인증 메일 전송 실패. 다시 시도해 주세요");
        }
    }

    const handleProfileUploadClick = () => {
        if(window.confirm("프로필 사진을 변경 하시겠습니까?")) {
            profileFileRef.current.click();
        }
    }

    const handleProfileChange = (e) => {
        const files = e.target.files;

        if(!files.length) {
            setUploadFiles([]);
            e.target.value = "";
            // 파일을 넣고 다시 파일을 넣을 때 취소한 경우 실행
            return;
        }

        for(let file of files) {
            setUploadFiles([...uploadFiles, file]);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgSrc(e.target.result);
        }

        reader.readAsDataURL(files[0])
    }

    const handleUploadSubmit = () => {
        const storageRef = ref(storage, `files/profile/${uploadFiles[0].name}`); //firebase.js에서 getStorage로 가져온 객체 , 업로드 되는 파일 이름
        const uploadTask = uploadBytesResumable(storageRef, uploadFiles[0]); // 파일 업로드 완료되는 코드
        
        uploadTask.on( // 업로드가 시작되면
            "state_changed",
            // progress bar만들 때 사용? - rc progress
            (snapshot) => { // 퍼센테이지가 들어있음
                setProgressPercent(
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes ) * 100)
                )
            },
            (error) => {
                console.error(error);
            },
            // 업로드 완료시 실행
            () => {
                getDownloadURL(storageRef).then(downloadUrl => { // DB에다가 넣을 사진 Url주소
                    const option = {
                        headers: {
                            Authorization: localStorage.getItem("accessToken")
                        }
                    }
                    instance.put("/account/profile/img", {profileUrl: downloadUrl}, option)
                        .then((response) => {
                            alert("프로필 사진이 변경되었습니다.");
                            window.location.reload();
                        });
                })
            }
        )
    }

    const handleUploadCancel = () => {
        setUploadFiles([]);
        profileFileRef.current.value = "";
    }

    return (
        <RootContainer>
            <div>
                <div css={infoHeader}>
                    <div>
                        <div css={imgBox} onClick={handleProfileUploadClick}>
                            <img src={profileImgSrc} alt="" />
                        </div>
                        <input css={file} onChange={handleProfileChange} type="file" ref={profileFileRef}/>
                        {!!uploadFiles.length &&
                            <div>
                                <Line percent={progressPercent} strokeWidth={4} strokeColor="crimson" />
                                <button onClick={handleUploadSubmit}>변경</button>
                                <button onClick={handleUploadCancel}>취소</button>
                            </div>
                        }
                    </div>
                    <div>
                        <h3>누적 포인트: {principal.userPoint} Point</h3><button onClick={() => {navigate("/store/products")}}>포인트 구매</button>
                    </div>
                </div>
                <div>
                    <div>닉네임: {principal.nickname}</div>
                    <div>이름: {principal.name}</div>
                    <div>
                        이메일: {principal.email} {principal.enabled ? <button disabled={true}>인증완료</button> : <button onClick={handleSendMail}>인증하기</button>}
                    </div>
                    <Link to={"/account/password"} >비밀번호 변경</Link>
                </div>
            </div>
        </RootContainer>
    );
}

export default Mypage;