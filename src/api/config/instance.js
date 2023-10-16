import axios from "axios";

// create : axios 전역 설정
export const instance = axios.create({
    baseURL: "http://localhost:8080"
});

// export const getAutthorizationOptions = () => {
    
// }
