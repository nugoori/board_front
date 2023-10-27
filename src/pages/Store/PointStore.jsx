import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SStoreContainer = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
`;

const SProductContainer = css`
    margin: 10px;
    width: 30%;
    height: 120px;
    cursor: pointer;
`;

function PointStore(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const getProducts = useQuery(["getProducts"], async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            return await instance.get("/products", option)
        } catch (error) {
            
        }
    },{
        retry: 0
    })

    useEffect(() => {
        // iamport js SDK
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.head.appendChild(iamport);
        // 언마운트 될 때
        return () => {
            document.head.removeChild(iamport);
        }
    }, [])

    const handlePaymentSubmit = (product) => {
        const principal = queryClient.getQueryState("getPrincipal");
        if(!window.IMP) {return} // IMP 위에 script에 넣어놓은 객체?
        const { IMP } = window;
        IMP.init("imp38533803") // 가맹점 식별 코드

        const paymentData =  {// requestPay()를 할 때 정보를 넣는 객체?
            pg: "kakaopay",
            pay_method: "kakaopay",
            merchant_uid: `mid_${new Date().getTime()}`, // 결제 식별 코드
            amount: product.productPrice,
            name: product.productName,
            buyer_name: principal?.data?.data?.name,
            buyer_email: principal?.data?.data?.email
        }

        IMP.request_pay(paymentData, (response) => {
            const { success, error_msg } = response;

            if(success) {
                // 우리 서버에 주문 데이터 insert
                const orderData = {
                    productId: product.productId,
                    email: principal?.data?.data?.email
                }
                const option = {
                    headers: {
                        Authorization: localStorage.getItem("accessToken")
                    }
                }
                instance.post("/order", orderData, option)
                    .then(response => {
                        alert("포인트 충전이 완료되었습니다.");
                        queryClient.refetchQueries(["getPrincipal"]);
                        navigate("/account/mypage");
                    })
            } else {
                alert(error_msg);
            }
        })
    }
    return (
        <RootContainer >
            <h1>포인트 충전하기</h1>
            <div css={SStoreContainer}>
                {!getProducts.isLoading && getProducts?.data?.data.map(product => {
                    return <button key={product.productId} css={SProductContainer} 
                                onClick={() => {handlePaymentSubmit(product)}}>
                                    {product.productName} Point
                            </button>
                })}
            </div>
        </RootContainer>
    );
}

export default PointStore;