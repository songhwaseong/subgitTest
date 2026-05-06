/* 
상품 상세 보기
전체 화면을 좌우측을 1대2로 분리합니다.
왼쪽은 상품의 이미지 정보, 오른쪽은 상품의 정보 및 `장바구니`와 `주문하기` 버튼을 만듭니다.
*/

import customAxios from "./../api/axiosInstance";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, API_CART_URL, API_IMAGE_URL, API_PRODUCT_URL } from "../config/config";
import type { Product } from "../types/Product";
import type { User } from "../types/User";
import { alertEx, confirmEx } from "../alert/Sweetalert2Confirm";
import QrCode from "./QrCode";

interface AppProps {
    user: User | null
}

function App({ user }: AppProps) {
    const { id } = useParams(); // id 파라미터 챙기기
    const [product, setProduct] = useState<Product | null>(null); // 백엔드에서 넘어온 상품 정보

    // 로딩 상태를 의미하는 state로, 값이 true이면 현재 로딩 중입니다.
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);

    const [errMsg, setErrMg] = useState('');

    const QuantityChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        e.preventDefault();
        // parseInt() 메소드는 정수형으로 생긴 문자열을 정수 값으로 변환해 줍니다.
        if (e.target.value === '') {
            //alertEx('숫자로 적어주세요.', function () { })
            setErrMg('숫자로 적어주세요');
            setQuantity(1);
        } else {
            const newValue = parseInt(e.target.value);
            setQuantity(newValue);
            setErrMg('');
        }
    };

    // 파라미터 id가 갱신이 되면 화면을 다시 rendering 시킵니다.
    useEffect(() => {
        const loginUser = localStorage.getItem("user");
        if (typeof loginUser === "string") {
            const parsed = JSON.parse(loginUser);   //json 문자열을 객체로 변환하여 상태에 저장
            user = parsed;
        }
        // if (user && user.role !== 'ADMIN' && user.role !== 'USER') {
        //     alertEx('로그인이 필요한 서비스입니다.', function () { navigate('/member/login'); })
        //     return;
        // }
        if (!user) {
            //alertEx('로그인이 필요한 서비스입니다.', function () { navigate('/member/login'); })
            return;
        }

        const url = `${API_PRODUCT_URL}/detail/${id}`;

        customAxios
            .get(url)
            .then((response) => {
                setProduct(response.data);
                setLoading(false); // 상품 정보를 읽어 왔습니다.
            })
            .catch((error) => {
                console.log(error);

                if (error.response && error.response.status === 401) { // 401(UnAuthrized)
                    //alertEx('로그인이 필요한 서비스입니다.1', function () { });
                    navigate('/member/login'); // 로그인 페이지로 리다이렉트 

                } else if (error.response.status === 404 && error.response.data.item === 'no') {
                    alertEx('해당 상품이 DB 데이터에 없습니다.', function () { });
                    navigate(-1); // 이전 페이지로 이동하기
                } else {
                    alertEx('상품 정보를 불러 오는 중에 오류가 발생하였습니다.', function () { });
                    navigate(-1); // 이전 페이지로 이동하기
                }
            });
    }, [id, user, navigate]);

    // 아직 backend에서 읽어 오지 못한 경우를 대비한 코딩입니다.
    if (loading === true) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 읽어 오는 중입니다.
                </h3>
            </Container>
        );
    }

    // 상품에 대한 정보가 없는 경우를 대비한 코딩입니다.
    if (!product) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 찾을 수 없습니다.
                </h3>
            </Container>
        );
    }



    const addToCart = async () => {
        if (!user) {
            alertEx('로그인이 필요합니다.', function () { navigate('/member/login'); });
            return;
        }

        if (!product) return;

        if (quantity < 1) {
            alertEx('구매 수량은 1개 이상이어야 합니다.', function () { });
            return;
        }
        //alert(`${product.name} ${quantity} 개를 장바구니에 담기`);

        // memberId: user.id,
        const parameters = {
            productId: product.id,
            quantity: quantity
        };

        const url = `${API_CART_URL}/insert`;
        await customAxios.post(url, parameters).then((res) => {
            confirmEx(res.data + ' 장바구니로 이동하시겠습니까? ', function () { navigate('/cart/list'); },
                function () { })
        }).catch((error) => {
            // 서버에서 받은 오류 정보를 객체로 저장합니다.
            //setErrors(error.response.data);
            console.log(error.response.data);

            alertEx(error.response.data, function () { });

        });



        // alert(response.data);
        // navigate('/product/list'); // 상품 목록 페이지로 이동

    }

    const buyNow = async () => {
        // if (quantity < 1) {
        //     alertEx('수량을 1개 이상 선택해 주셔야 합니다.', function () { });
        //     return;
        // }

        const url = `${API_BASE_URL}/order`;
        const parameters = {
            memberId: user?.id,
            status: 'PENDING',
            orderItems: [{
                productId: product.id,
                quantity: quantity,
                price: product.price
            }]
        };
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };

        console.log('주문할 데이터 정보');
        console.log(parameters);

        await customAxios.post(url, parameters, config).then((res) => {
            console.log(res.data);
            alertEx(`${product.name} ${quantity}개를 주문하였습니다.`, function () {
                setProduct({ ...product, stock: (product.stock - quantity) });
                navigate('/order/list');
            })
        }).catch((error) => {
            console.log('주문 기능 실패');
            console.log(error);
            alertEx(error.response.data, function () { setQuantity(1) });
        });
    };

    const ButtonRender = () => {
        if (product.stock > 0) {
            return <>
                <Button variant="danger" className="me-3 px-4"
                    onClick={() => {
                        if (!user) {
                            alertEx('로그인이 필요한 서비스입니다.', function () { navigate('/member/login'); });
                            return;
                        } else {
                            buyNow();
                        }
                    }}
                >
                    주문하기
                </Button>
            </>
        } else {
            return <>
                <Button variant="danger" className="me-3 px-4">
                    품절
                </Button>
            </>
        }
    }

    const modifyBtn = () => {
        return user?.role === 'ADMIN' &&
            <><Button variant="primary" className="me-3 px-4" onClick={(e) => { e.stopPropagation(); navigate(`/product/update/${id}`); }}>
                수정
            </Button></>
    }

    return (
        <Container className="my-4">
            <Card >
                {errMsg && <Alert variant="danger">{errMsg}</Alert>}
                <Row className="g-0"  >
                    {/* 좌측 상품 이미지 */}
                    <Col md={4} >
                        <Card.Img
                            variant="top"
                            src={`${API_IMAGE_URL}/${product.image}`}
                            alt={`${product.name}`}
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Col>
                    {/* 우측 상품 정보 및 구매 관련 버튼 */}
                    <Col md={8} >
                        <Card.Body>
                            <Card.Title className="fd-3" style={{ display: 'flex', alignItems: 'baseline' }}>
                                <h3>{product.name}</h3>
                                <QrCode {...product} />
                            </Card.Title>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <td className="text-center">가격</td>
                                        <td>{product.price.toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">카테고리</td>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">재고</td>
                                        <td>{product.stock.toLocaleString()}개</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">설명</td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">등록일자</td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            {/* 구매 수량 입력란 */}
                            {/* as={Row}는 렌더링시 기본 값인 <div> 말고 Row로 렌더링하도록 해줍니다. */}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Col xs={3} className="text-center">
                                    <strong>구매 수량</strong>
                                </Col>
                                <Col xs={5}>
                                    {/* 구매 수량은 최소 1이상으로 설정했고, user 모드에 따라서 분기 코딩했습니다. */}
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        disabled={!user}
                                        value={quantity}
                                        onChange={QuantityChange}
                                    />
                                </Col>
                            </Form.Group>

                            {/* 버튼(이전 목록, 장바구니, 주문하기) */}
                            <div className="d-flex justify-content-center mt-3">
                                <Button variant="primary" className="me-3 px-4" href="/product/list">
                                    이전 목록
                                </Button>
                                <Button variant="success" className="me-3 px-4"
                                    onClick={() => {
                                        if (!user) {
                                            alertEx('로그인이 필요한 서비스입니다.', function () { navigate('/member/login'); });
                                            return;
                                        } else {
                                            addToCart();
                                        }
                                    }}
                                >
                                    장바구니
                                </Button>
                                {ButtonRender()}
                                {modifyBtn()}
                                {/* {user?.role === 'ADMIN' && <><Button variant="primary" className="me-3 px-4" onClick={(e) => { e.stopPropagation(); navigate(`/product/update/{id}`) }}>
                                    수정
                                </Button></>
                                } */}
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container >
    );
}

export default App;