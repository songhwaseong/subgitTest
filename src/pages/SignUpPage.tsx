import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { API_MEMBER_URL } from "../config/config";
import { alertEx } from "../alert/Sweetalert2Confirm";
import DaumPostcode from "react-daum-postcode";

function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");

    const initial_errors = {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        address: "",
        addressDetail: "",
        general: ""
    }

    const [errors, setErrors] = useState(initial_errors);

    const navigate = useNavigate();

    const SingUpAction = async (event: React.SubmitEvent) => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            alertEx('비밀번호 확인부탁드립니다.', function () { });
            return;
        }
        const url = `${API_MEMBER_URL}/signup`;
        const config = { withCredentials: true };
        const paramters = { name, email, password, address, addressDetail };
        await axios.post(url, paramters, config).then((response) => {
            if (response.status === 200) {
                alertEx(response.data.name + "님의 회원 가입 완료. \n ", function () { navigate(`/member/login`); });
            }
        }).catch((error) => {
            if (axios.isAxiosError(error)) {
                setErrors(initial_errors);
                if (error.response?.data?.errors) {
                    // 서버에서 받은 오류 정보를 객체로 저장합니다.

                    setErrors((prev) => ({
                        ...prev,
                        ...error.response?.data?.errors,
                        general: error.response?.data?.message || '회원 등록 유효성 검사에 문제가 있습니다.'
                    }));
                    alertEx(errors.general || '회원 등록 유효성 검사에 문제가 있습니다.', function () { });
                    //setErrors(error.response.data);
                    console.log(error.response.data);
                }
            }
        });
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handle = {
        selectAddress: (data: any) => {
            setAddress(data.roadAddress);
            handleClose();
        },
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원 가입</h2>

                            {/* 일반 오류 발생시 사용자에게 alert 메시지를 보여 줍니다. */}
                            {/* contextual : 상황에 맞는 적절한 스타일 색상을 지정하는 기법 */}
                            {/* {errors.general && <Alert variant="danger">{errors.general}</Alert>} */}

                            {/*
                                !! 연산자는 어떠한 값을 강제로 boolean 형태로 변환해주는 자바스크립트 기법입니다.

                                isInvalid 속성은 해당 control의 유효성을 검사하는 속성입니다.
                                값이 true이면 Form.Control.Feedback에 빨간 색상으로 오류 메시지를 보여 줍니다.
                            */}
                            <Form onSubmit={SingUpAction}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={3}>
                                        이름
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="text"
                                            placeholder="이름을 입력해 주세요"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={3}>
                                        이메일
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="email"
                                            placeholder="이메일을 입력해 주세요       ex) abc@abc.abc"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={3}>
                                        비밀번호
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="password"
                                            placeholder="비밀번호를 입력해 주세요"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={3}>
                                        비밀번호 확인
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="password"
                                            placeholder="비밀번호를 한번 더 입력해 주세요"
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            isInvalid={passwordConfirm !== '' && password !== passwordConfirm}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {'패스워드가 다릅니다.'}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={3}>
                                        주소
                                    </Form.Label>
                                    <Col sm={6}>
                                        <Form.Control
                                            type="text"
                                            placeholder="주소를 입력해주세요"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            onClick={handleShow}
                                            readOnly
                                            isInvalid={!!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col sm={3}>
                                        <Button variant="secondary" onClick={handleShow}>
                                            주소
                                        </Button>
                                    </Col>
                                </Form.Group>
                                {address && <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={3}>
                                        상세주소
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="text"
                                            placeholder="나머지 주소를 입력해 주세요"
                                            value={addressDetail}
                                            onChange={(e) => setAddressDetail(e.target.value)}
                                        />
                                        <Form.Control.Feedback />
                                    </Col>
                                </Form.Group>}
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        회원 가입
                                    </button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>주소 검색</Modal.Title>
                </Modal.Header>
                <Modal.Body><DaumPostcode
                    onComplete={(data) => {
                        handle.selectAddress(data);
                    }}
                    autoClose={false}
                /></Modal.Body>
            </Modal>
        </Container>

    )
}
export default App;
