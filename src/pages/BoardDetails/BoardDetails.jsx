import React from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const boardContainer = css`
    position: relative;
    width: 1100px;
`

const line = css`
    border-bottom: 2px solid #dbdbdb;
    margin: 30px 0px;
    width: 100%;
`

const contentContainer = css`
    width: 100%;
    word-wrap: break-word;
    
    & * {
        word-wrap: break-word;
    }

    & img {
        max-width: 100%;
    }
`

const SBoardTitle = css`
    width: 100%;
    font-size: 50px;
    word-wrap: break-word; // 다음 줄로 넘어가고 필요한 경우 단어의 줄바꿈도 동시에 일어남
    /* white-space: normal; // 너비를 초과할 경우 줄바꿈 허용 */
`

const SSideOption = css`
    position: absolute;
    right: -80px;
    height: 100%;
`

const SLikeButton = (isLike) => css`
    position: sticky;
    top: 150px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    background-color: ${isLike ? "pink" : "#fff"};
    cursor: pointer;
`

function BoardDetails(props) {

    const queryClient = useQueryClient();
    const principal = queryClient.getQueryState("getPrincipal");

    const { boardId } = useParams();
    const [ board, setBoard ] = useState("");

    const getBoard = useQuery(["getBoard"], async () => {
        try {
            return await instance.get(`/board/${boardId}`)
        } catch (error) {
            console.error(error);
        }
    },{
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setBoard(response.data);
        }
    })
    
    const getLikeState = useQuery(["getLikeState"], async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            return await instance.get(`/board/like/${boardId}`, option)
        } catch (error) {
            console.error(error);
        }
    },{
        refetchOnWindowFocus: false,
        retry: 0
    })

    if(getBoard.isLoading) {
        return <></>
    }

    const handleLikeButtonClick = async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            if(!!getLikeState?.data?.data) {
                await instance.delete(`/board/like/${boardId}`, option)
            } else {
                await instance.post(`/board/like/${boardId}`, {}, option)
            }
            getLikeState.refetch();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RootContainer>
            <div css={boardContainer}>
                <div css={SSideOption}>
                    {!getLikeState.isLoading && 
                        <button disabled={!principal?.data?.data} css={SLikeButton(getLikeState?.data?.data)} onClick={handleLikeButtonClick}>
                            <div>❤</div>
                            <div>10</div>
                        </button >
                    }
                </div>
                <h1 css={SBoardTitle}>{board.boardTitle}</h1>
                <p><b>{board.nickname}</b> - {board.createDate}</p>
                <div css={line}></div>
                <div css={contentContainer} dangerouslySetInnerHTML={{ __html: board.boardContent}}></div>
            </div>
        </RootContainer>
    );
}

export default BoardDetails;