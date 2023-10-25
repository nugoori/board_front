import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import RootContainer from '../../components/RootContainer/RootContainer';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

const buttonContainer = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 50px;
    width: 100%;
`

const categoryContainer = css`
    display: flex;
    margin-bottom: 10px;
`

const styleBox = css`
    flex-grow: 1;
    margin-right: 10px;
`

const titleInput = css`
    margin-bottom: 10px;
    width: 100%;
    height: 50px;
`

function BoardWrite(props) {

    const navigate = useNavigate();

    const [ boardContent, setBoardContent ] = useState({
        title: "",
        content: "",
        categoryId: 0,
        categoryName: ""
    });
    const [ categories, setCategories ] = useState([]);
    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(selectOptions[0]);

    const queryClient = useQueryClient();

    useEffect(() => {
        const principal = queryClient.getQueryState("getPrincipal");
        if(!principal.data) {
            alert("로그인 후에 게시글을 작성 할 수 있습니다.");
            window.location.replace("/");
            return;
        }

        if(!principal?.data?.data.enabled) {
            alert("이메일 인증 후에 게시글을 작성 할 수 있습니다.");
            window.location.replace("/account/mypage");
            return;
        }
    }, [])

    useEffect(() => {
        instance.get("board/categories")
            .then((resonse) => {
                setCategories(resonse.data);
                setSelectOptions(
                    resonse.data.map(
                        category => {
                            return { value: category.boardCategoryId, label:category.boardCategoryName }
                        }
                    )
                );
            });
    }, [])

    useEffect(() => {
        if(!!newCategory) {
            const newOption = {value: 0, label: newCategory};

            setSelectedOption(newOption);
            if(!selectOptions.map(option => option.label).includes(newOption.label)) {
                setSelectOptions([
                    ...selectOptions,
                    newOption
                ])
            }
        }
    }, [newCategory])

    useEffect(() => {
        // const boardCategory = categories.filter(category => category.boardCategoryName === selectedOption?.value)[0];
        // const categoryId = !!boardCategory ? boardCategory.boardCategoryId : 0;

        setBoardContent({
            ...boardContent,
            categoryId: selectedOption?.value,
            categoryName: selectedOption?.label
        })
    }, [selectedOption])

    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, 3, false]}],
                ["bold", "underline"],
                ["image"]
            ]
        }
    }

    const handleTitleInput = (e) => {
        setBoardContent({
            ...boardContent,
            title: e.target.value
        })
    }

    const handleContentInput = (value) => {
        setBoardContent({
            ...boardContent,
            content: value
        })
    }

    const handleSelectChange = (option) => {
        setSelectedOption(option);
    }

    const handleCategoryAdd = () => {
        const categoryName = window.prompt("새로 추가할 카테고리명을 입력하세요")
        if(!categoryName) {
            return;
        }
        setNewCategory(categoryName);
    }

    const handleWriteSubmit = async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            console.log(boardContent);
            await instance.post("/board/content", boardContent, option)
            
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <RootContainer>
            <div>
                <h1>글쓰기</h1>
                <div css={categoryContainer}>
                    <div css={styleBox}>
                        <Select 
                            options={selectOptions}
                            onChange={handleSelectChange}
                            defaultValue={selectedOption}
                            value={selectedOption}
                            />
                    </div>
                    <button onClick={handleCategoryAdd}>카테고리 추가</button>
                </div>
                <div><input css={titleInput} type="text" name='title' placeholder='제목' onChange={handleTitleInput}/></div>
            </div>
            <div>
                <ReactQuill 
                    style={{boxSizing: "border-box", width: "928px", height: "500px"}} 
                    modules={modules}
                    onChange={handleContentInput}/>
            </div>
            <div css={buttonContainer}>
                <button onClick={handleWriteSubmit}>작성하기</button>
            </div>
        </RootContainer>
    );
}

export default BoardWrite;