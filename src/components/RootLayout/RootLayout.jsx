import React from 'react';
import Header from '../Header/Header';
// 기본 설정 -> 사용자 코드 조각 구성 -> 코드조각 파일 만들기 -> 설정
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */

const layout = css`
    margin: 20px auto;
    width: 1300px;

`;


function RootLayout({children}) {

    return (
        <div css={layout}>
            <Header />
            {children}
        </div>
    );
}

export default RootLayout;