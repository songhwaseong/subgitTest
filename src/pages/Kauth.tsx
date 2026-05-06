import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User.ts";
import axios from "axios";
import { API_MEMBER_URL } from "../config/config.tsx";
import { Container, Spinner } from "react-bootstrap";

interface Props {
    onLogin: (user: User) => void;
}

function Kauth({ onLogin }: Props) {
    const navigate = useNavigate();

    // 백엔드로 코드값을 넘겨주는 로직
    // 요청 성공 코드값

    useEffect(() => {
        const kakaoLogin = async () => {

            const code = new URL(window.location.href).searchParams.get("code");
            if (!code) return;

            if (sessionStorage.getItem('kakao_code_used') === code) return;
            sessionStorage.setItem('kakao_code_used', code);

            const params = {
                code
            };
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            await axios.post(
                `${API_MEMBER_URL}/kakaoLogin`,
                params, config).then((response) => {
                    console.log("백앤드연결:", response.data);
                    const { accessToken, ...userData } = response.data;
                    localStorage.setItem("accessToken", accessToken);
                    if (onLogin) {      //로그인 처리(함수 또는 상태)가 정의되어 있다면 ~을 해라
                        onLogin(userData);
                        localStorage.setItem("user", JSON.stringify(userData));
                    }
                    navigate("/");
                }).catch((error) => {
                    console.error("로그인 실패:", error);
                })
        };
        kakaoLogin();

        // 요청이 성공하면 navigate('/main')
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default Kauth;
