import React, { useEffect, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import Select from 'react-select';
import ReactQuill from 'react-quill';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { instance } from '../../api/config/instance';

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

function BoardUpdate(props) {

    const { boardId } = useParams();

    const getBoardUpdate = useQuery(["getBoardUpdate"], async () => {
        try {
            return await instance.get(`/board/update/${boardId}`)
        } catch (error) {
            console.error(error);
        }
    },{
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setBoardContent(response.data);
        }
    })

    const [ boardContent, setBoardContent ] = useState({
        title: "",
        content: "",
        categoryId: 0,
        categoryName: ""
    });
    const [ categories, setCategories ] = useState([]);
    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState();

    useEffect(() => {
        instance.get("board/categories")
            .then((resonse) => {
                setCategories(getBoardUpdate?.data?.data?.categoryId);
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

    if(getBoardUpdate.isLoading) {
        return <></>
    }

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

    const handleUpdateSubmit = async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            instance.put(`/board/update/${boardId}`, boardContent, option)
        } catch (error) {
            
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
                <div><input css={titleInput} type="text" name='title' placeholder={getBoardUpdate?.data?.data?.boardTitle} onChange={handleTitleInput}/></div>
            </div>
            <div>
                <ReactQuill 
                    style={{boxSizing: "border-box", width: "928px", height: "500px"}} 
                    modules={modules}
                    onChange={handleContentInput}
                    defaultValue={getBoardUpdate?.data?.data?.boardContent}
                    />
            </div>
            <div css={buttonContainer}>
                <button onClick={handleUpdateSubmit}>수정하기</button>
            </div>
        </RootContainer>
    );
}

export default BoardUpdate;