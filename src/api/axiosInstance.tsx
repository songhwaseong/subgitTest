import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { alertEx } from "../alert/Sweetalert2Confirm";


const axiosInstance = axios.create({
    baseURL: API_BASE_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        } else {
            alertEx('토큰정보가 없습니다. \n 로그인페이지로 이동합니다. ', function () { window.location.replace("/member/login"); })
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터를 추가하여 401 Unauthorized 오류를 처리합니다.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config.url?.includes("/member/login");
        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            // alertEx('인증 실패: 토큰이 유효하지 않거나 만료되었습니다. \n로그인 페이지로 이동합니다.', function () {
            //     window.location.replace("/member/login");
            // });

            window.location.replace("/member/login");

        }
        return Promise.reject(error);
    }
);

export default axiosInstance;