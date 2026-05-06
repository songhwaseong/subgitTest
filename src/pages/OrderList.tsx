import customAxios from './../api/axiosInstance';

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";

import { Alert, Button, Card, Col, Container, Nav, Row, Spinner } from "react-bootstrap";

import type { Order } from "../types/Order";
import type { User } from "../types/User";
import { alertEx } from '../alert/Sweetalert2Confirm';
import { useNavigate } from 'react-router-dom';

type AppProps = {
    user: User | null; // user는 User 객체 혹은 null일 수도 있습니다.
}

function App({ user }: AppProps) {
    // loading이 true이면 현재 데이터를 읽고 있는 중입니다.
    const [loading, setLoading] = useState(true);

    // 오류 정보를 저장할 스테이트
    const [error, setError] = useState('');

    // 주문 목록들을 저장할 스테이트(초기 값 : 빈 배열)
    const [orders, setOrders] = useState<Order[]>([]);

    const navigate = useNavigate();

    // 스프링 부트의 OrderController의 getOrderList() 메소드 참조
    const fetchOrders = async () => {
        const url = `${API_BASE_URL}/order/list`;

        // get 방식은 파라미터를 넘길 때, params라는 키를 사용하여 넘겨야 합니다.
        const parameters = {
            params: {
                memberId: user?.id,
                role: user?.role
            }
        };
        await customAxios.get(url, parameters).then((res) => {

            setOrders(res.data);

            console.log('get 방식 : /order/list');
            console.log(res.data);
        }).catch((error) => {
            setError('주문 목록을 불러 오는 데 실패하였습니다.');
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    };

    // 다음의 hook은 사용자 정보 user가 변경될 때 마다 rendering 됩니다.
    useEffect(() => {
        const loginUser = localStorage.getItem("user");
        if (typeof loginUser === "string") {
            const parsed = JSON.parse(loginUser);   //json 문자열을 객체로 변환하여 상태에 저장
            user = parsed;
        }
        if (!user) {
            setError('로그인이 필요합니다.');
            setLoading(false);
            return;
        }

        fetchOrders(); // 함수 호출

    }, [user]);

    const makeStatusButton = (bean: Order) => {
        if (user?.role !== "ADMIN" && user?.role !== "USER") return null;

        // `완료` 버튼을 클릭하여 `PENDING` 모드를 `COMPLETED` 모드로 변경합니다.
        const changeCompleted = async (newStatus: string) => {
            try {
                const url = `${API_BASE_URL}/order/update/status/${bean.orderId}?status=${newStatus}&manageId=${user?.id}`;
                await customAxios.put(url);

                alertEx(`송장 번호 ${bean.orderId}의 주문 상태가 ${newStatus}으로 변경이 되었습니다.`, function () { });

                // `COMPLETED` 모드로 변경되고 나면, 화면에 보이지 않습니다.
                // bean.orderId와 동일하지 않은 항목들만 다시 rendering 합니다.
                // setOrders((previous) =>
                //     previous.filter((order) => order.orderId !== 0)
                // );
                fetchOrders();

            } catch (error) {
                console.log(error);
                alertEx('상태 변경(주문 완료)에 실패하였습니다.', function () { });
            }
        };

        // `취소` 버튼을 클릭하여 `대기 상태`인 주문 내역을 취소합니다.
        // const orderCancel = async () => {
        //     try {
        //         const url = `${API_BASE_URL}/order/delete/${bean.orderId}`;
        //         await customAxios.delete(url);

        //         alertEx(`송장 번호 ${bean.orderId}의 주문이 취소 되었습니다.`, function () { });

        //         // bean.orderId와 동일하지 않은 항목들만 다시 rendering 합니다.
        //         setOrders((previous) =>
        //             previous.filter((order) => order.orderId !== bean.orderId)
        //         );

        //     } catch (error) {
        //         console.log(error);
        //         alertEx('주문 취소에 실패하였습니다.', function () { });
        //     }
        // };

        return (
            <div className="d-flex align-items-center">
                {/* 관리자일 때 사용자 이름 표시 */}
                {user?.role === 'ADMIN' && (
                    <Nav.Link onClick={() => navigate(`/member/info`, { state: { email: bean.email } })}>
                        <span
                            className="me-3 px-3 py-1 border rounded fw-bold text-primary"
                            style={{
                                borderColor: '#0d6efd',   // 테두리 색상 (Bootstrap primary)
                                backgroundColor: 'transparent', // 내부 채우기 제거
                                fontSize: '0.9rem',
                            }}
                        >
                            👤
                            {bean.name}
                        </span>
                    </Nav.Link>
                )}
                {/* `완료` 버튼은 관리자만 볼수 있습니다. */}
                {user?.role === 'ADMIN' && bean.status == 'PENDING' && (
                    <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => changeCompleted('COMPLETED')}
                    >
                        완료
                    </Button>
                )}

                {bean.status == 'PENDING' && (
                    <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => changeCompleted('CANCELED')}
                    >
                        취소
                    </Button>
                )}
                {bean.manageId && (
                    <span>관리자ID : {bean.manageId}</span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }



    return (
        <Container className="my-4">
            <h1 className="my-4">주문 내역</h1>
            {orders.length === 0 ? (
                <Alert variant="secondary">주문 내역이 없습니다.</Alert>
            ) : (
                <Row>
                    {orders.map((bean) => (
                        <Col key={bean.orderId} md={6} className="mb-4">
                            <Card
                                className="h-100 shadow-sm"
                                style={{
                                    border: '2px solid #495057'
                                }}
                            >
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>주문 번호 : {bean.orderId}</Card.Title>
                                        <small className="text-muted">{bean.orderDate}</small>
                                    </div>

                                    <Card.Text className="text-start">
                                        상태 : <strong>{bean.status}</strong>
                                    </Card.Text>
                                    <div className="text-start">
                                        <ul>
                                            {bean.orderItems.map((item, index) => (
                                                <li key={index}>
                                                    <Nav.Link onClick={() => navigate(`/product/detail/${item.productId}`)}>
                                                        {item.productName}  {item.quantity}개   {(item.quantity * item.price).toLocaleString()}원
                                                    </Nav.Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* 주문 상태 변경 버튼 생성 */}
                                    {makeStatusButton(bean)}

                                </Card.Body>

                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );

}

export default App;