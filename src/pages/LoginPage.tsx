import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import type { LoginResponse, User } from "../types/User.ts";
import axios from "axios";
import { API_BASE_URL, API_MEMBER_URL, kko_client_id, kko_redirectURI, nav_client_id, nav_redirectURI, nav_state } from "../config/config.tsx";
import { alertEx } from "../alert/Sweetalert2Confirm";

interface Props {
    onLogin: (user: User) => void;
}

function Login({ onLogin }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(false);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    const [code, setCode] = useState("");

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log('로그인 시도 중...');
        const params = {
            email,
            password,
            autoLogin
        };
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        await axios.post<LoginResponse>(
            `${API_MEMBER_URL}/login`,
            params, config).then((response) => {
                const { accessToken, ...userData } = response.data;
                localStorage.setItem("accessToken", accessToken);
                if (onLogin) {      //로그인 처리(함수 또는 상태)가 정의되어 있다면 ~을 해라
                    onLogin(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                }
                navigate("/");
            }).catch((error) => {
                console.error("로그인 실패:", error);
                setErrors("로그인에 실패했습니다. \n 이메일과 비밀번호를 확인해주세요.");
            })
    };

    // 백엔드로 코드값을 넘겨주는 로직
    // 요청 성공 코드값

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        const state = new URL(window.location.href).searchParams.get("state");
        console.log(window.location.href);
        console.log(code);
        console.log(state);
        const naverLogin = async () => {

            setCode(new URL(window.location.href).searchParams.get("code") || "");
            console.log(code);

            const params = {
                code
            };
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            await axios.post(
                `${API_MEMBER_URL}/naverLogin`,
                params, config).then((response) => {
                    const { accessToken, ...userData } = response.data;
                    localStorage.setItem("accessToken", accessToken);
                    if (onLogin) {      //로그인 처리(함수 또는 상태)가 정의되어 있다면 ~을 해라
                        onLogin(userData);
                        localStorage.setItem("user", JSON.stringify(userData));
                    }
                    navigate("/");
                }).catch((error) => {
                    console.error("로그인 실패:", error);
                    setErrors("로그인에 실패했습니다. \n 이메일과 비밀번호를 확인해주세요.");
                })
        };
        // naverLogin();

        // 요청이 성공하면 navigate('/main')
    }, []);

    const nav_apiUrl = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + `${nav_client_id}&redirect_uri=${nav_redirectURI}&state=${nav_state}`;
    const kko_apiUrl = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=' + `${kko_client_id}&redirect_uri=${kko_redirectURI}`;
    // const naverLogin = () => {
    //     axios.get(api_url).then((res) => {
    //         console.log(res);
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    //     //alertEx("네이버 로그인은 현재 지원되지 않습니다.", function () { });
    // };

    const autoLoginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail("nanage@nanage.com");
        setEmail("im_a_batman@naver.com");
        setEmail("shs_7987@hanmail.net");
        setEmail("supyoungsun@gmail.com");
        setPassword("Songhwasung!1");
        setAutoLogin(!!e.target.checked);
    };

    // const setLoginInfo = (e: React.MouseEvent<HTMLInputElement>) => {
    //     e.preventDefault();

    //     console.log('자동 로그인 체크됨');
    //     setEmail("supyoungsun@gmail.com");
    //     setPassword("Songhwasung!1");
    // }
    return (
        <>
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <Row className="w-100 justify-content-center" style={{ display: 'flow' }}>
                    <Col md={6} sm={10}>
                        <Card>
                            <Card.Body>
                                <h2 className="text-center mb-4">로그인</h2>

                                {/* {errors && <Alert variant="danger">{errors}</Alert>} */}
                                <>{errors && alertEx(errors, function () { })}</>
                                <Form onSubmit={handleLogin}>
                                    <Form.Group as={Row} className="mb-3 align-items-center">
                                        <Form.Label column sm={3} className="text-end fw-bold text-primary">
                                            이메일
                                        </Form.Label>
                                        <Col sm={9}>
                                            <Form.Control
                                                type="email"
                                                placeholder="이메일을 입력해 주세요."
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 align-items-center">
                                        <Form.Label column sm={3} className="text-end fw-bold text-primary">
                                            비밀 번호
                                        </Form.Label>
                                        <Col sm={9}>
                                            <Form.Control
                                                type="password"
                                                placeholder="비밀 번호를 입력해 주세요."
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Col>
                                        <Col xs="auto" className="my-1">
                                            <Form.Check
                                                type="checkbox"
                                                id="autoLogin"
                                                label="자동로그인"
                                                onChange={autoLoginHandler}
                                            />
                                        </Col>
                                    </Form.Group>


                                    <Row className="g-2">
                                        <Col xs={8}>
                                            <Button variant="primary" type="submit" className="w-100">
                                                로그인
                                            </Button>
                                        </Col>
                                        <Col xs={4}>
                                            <Link to="/member/signup" className="btn btn-outline-secondary w-100">
                                                회원 가입
                                            </Link>

                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} sm={10} className="d-flex flex-column align-items-center justify-content-center"                    >
                        <a href={nav_apiUrl} rel="noopener noreferrer">
                            <img src="http://localhost:9000/images/NAVER_login_Light_KR_green_narrow_H48.png" style={{ width: 180, height: 40, marginTop: 30 }} />
                        </a>
                    </Col>
                    <Col md={4} sm={10} className="d-flex flex-column align-items-center justify-content-center"                    >
                        <a href={kko_apiUrl} rel="noopener noreferrer">
                            <img src="http://localhost:9000/images/kakao_login_large_narrow.png" style={{ width: 180, height: 40, marginTop: 30 }} />
                        </a>
                    </Col>
                </Row>
            </Container >
        </>
    );
}

export default Login;
