import customAxios from "../api/axiosInstance";

import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Image, Nav, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL, API_CART_URL, API_IMAGE_URL } from "../config/config";
import type { CartProduct } from "../types/CartProduct";
import type { User } from "../types/User";
import { alertEx, confirmEx } from "../alert/Sweetalert2Confirm";
/*
다음 오류 일단 무시 바람
CartList.tsx:90 You provided a `checked` prop to a form field without an `onChange` handler. 
This will render a read-only field. If the field should be mutable use `defaultChecked`. 
Otherwise, set either `onChange` or `readOnly`.
*/

/* 
구조 분해 할당 + 타입 지정

정석적인 표현은 이렇습니다.
    function App(props: AppProps) {
        const user = props.user;
    }

줄여서 쓴 것이:
    function App({ user }: AppProps)
*/

type AppProps = {
    user: User | null; // user는 User 객체 혹은 null일 수도 있습니다.
}

function App({ user }: AppProps) {
    /* TypeScript가 CSS 속성(특히 textAlign)을 구체적인 리터럴 타입(예: 'center')이 아닌 
        일반 'string' 타입으로 인식하여 React.CSSProperties 타입과 호환되지 않을 때 발생합니다. */
    //const thStyle: React.CSSProperties = { fontSize: '1.2em', textAlign: 'center' }; // 테이블 헤더 스타일 center 는 
    const thStyle = { fontSize: '1.2em', textAlign: 'center' } as const; // 테이블 헤더 스타일 center 는 


    // 보여 주고자하는 `카트 상품` 배열 정보
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

    // 사용자의 정보가 바뀔 때 화면을 렌더링해주어야 합니다.
    // user?.id : Optional Chaining(물음표를 적어 주면 오류가 발생하지 않고 undefined를 반환해 줍니다.)
    // 즉, 오류 화면을 보여 주지 않고 아무런 일이 없었다는 듯이 동작함
    useEffect(() => {
        // if (user && user?.id) {
        //     fetchCartProducts();
        // }
        user && user?.id && fetchCartProducts();
    }, [user]);

    const navigate = useNavigate();

    // 특정 고객이 장바구니에 담은 `카트 상품` 목록을 조회합니다.
    const fetchCartProducts = async () => {
        const url = `${API_CART_URL}/list`;

        await customAxios
            .get(url, {})
            .then((response) => {
                setCartProducts(response.data || []);
            })
            .catch((error: any) => {
                console.log('오류 정보');
                console.log(error);
                alertEx(error.response.data, function () { navigate('/product/list'); });
            });

    };


    // 화면에 보여 주는 주문 총 금액을 위한 스테이트
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);

    // 전체 체크 스테이트 
    const [isAllCheck, setIsAllCheck] = useState(false);

    const [errMsg, setErrMg] = useState('');

    // 체크 박스의 상태가 Toggle될 때 마다, 전체 요금을 다시 재계산하는 함수입니다.
    const refreshOrderTotalPrice = (products: CartProduct[]) => {
        let total = 0; // 총 금액 변수

        products.forEach((bean) => {
            // if (bean.checked) { // 선택된 체크 박스에 대하여
            //     total += bean.price * bean.quantity; // 총 금액 누적
            // }

            bean.checked && (total += bean.price * bean.quantity); // 총 금액 누적
        });

        setOrderTotalPrice(total); // State 업데이트
    };



    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const handleApiError = (error: any) => {
        console.log(error);
        if (error.response) {
            const msg = error.response.data;
            setErrorMessage(msg);
        } else {
            setErrorMessage('서버와 통신할 수 없습니다.');
        }
    }

    // `전체 선택` 체크 박스를 Toggle 했습니다.
    const toggleAllCheckBox = (isAllCheck: boolean) => {
        setIsAllCheck(!!isAllCheck);
        // isAllCheck : `전체 선택` 체크 박스의 boolean 값
        setCartProducts((previous) => {
            // 모든 객체(카트 상품)들의 나머지 속성은 보존하고, 체크 상태(checked)를 
            // `전체 선택` 체크 상태와 동일하게 설정합니다.
            previous = previous.map((product) => ({
                ...product,
                checked: isAllCheck
            }));

            // 비동기적 렌더링 문제로 수정된 updatedProducts 항목을 매개 변수로 넘겨야 정상적으로 동작합니다.
            refreshOrderTotalPrice(previous);

            return previous;
        });
    };

    // 개별 체크 박스를 클릭하였습니다.
    const toggleCheckBox = (cartProductId: number) => {

        setCartProducts((previous) => {
            // !product.checked는 체크 상태를 toggle 시키는 역할을 합니다.
            previous = previous.map((product) =>
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product
            );
            setIsAllCheck(previous.filter(p => p.checked).length === previous.length);
            refreshOrderTotalPrice(previous);
            return previous;
        });
    };

    const checkedFalse = () => {
        setCartProducts((previous) => {
            // !product.checked는 체크 상태를 toggle 시키는 역할을 합니다.
            previous = previous.map((product) =>
                product.checked ?
                    { ...product, checked: !product.checked }
                    : product
            );
            return previous;
        });
        setIsAllCheck(isAllCheck ? !isAllCheck : isAllCheck);
    };

    // 카트 상품 목록에서 특정 상품의 구매 수량을 변경하였습니다.
    const changeQuantity = async (cartProductId: number, quantity: number) => {
        // NaN : Not A Number
        if (isNaN(quantity)) { // 숫자 형식이 아니면
            // 값을 0으로 변경한 다음, 함수를 반환하도록 합니다.
            setCartProducts((previous) => {
                return previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: 1 }
                        : product
                );
            });
            setErrMg('변경 수량은 최소 1이상이어야 합니다.')
            //alertEx('변경 수량은 최소 1이상이어야 합니다.', function () { });
            return;
        }
        setErrMg('');
        // 사용 예시 : 100번 항목을 10개로 수정해주세요.
        // http://localhost:9000/cart/edit/100?quantity=10
        const url = `${API_CART_URL}/edit/${cartProductId}?quantity=${quantity}`;

        // patch 동작은 전체가 아닌 일부 데이터를 변경하고자 할때 사용됩니다.
        // 스프링의 WebConfig 클래스안의 addCorsMappings() 메소드를 참조하시길 바랍니다.            
        await customAxios.patch(url, {}).then((res) => {
            // cartProducts의 수량 정보를 갱신합니다.
            setCartProducts((previous) => {
                const updatedProducts = previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: quantity }
                        : product
                );

                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });
            console.log(res.data);
        }).catch((error) => {
            alertEx('수량을 변경하지 못했습니다. ' + error.response.data, function () { });
            console.log(error);
        })
    };

    // 선택된 항목의 `카트 상품` 아이디를 이용하여 해당 품목을 목록에서 배제합니다.
    const deleteCartProduct = async (cartProductId: number) => {

        confirmEx('해당 카트 상품을 정말로 삭제하시겠습니까?', async function () {

            const url = `${API_CART_URL}/delete/${cartProductId}`;
            await customAxios.delete(url).then((res) => {

                // 카트 상품 목록을 갱신하고, 요금을 다시 계산합니다.
                setCartProducts((previous) => {
                    const updatedProducts = previous.filter((bean) => bean.cartProductId !== cartProductId);

                    refreshOrderTotalPrice(updatedProducts);
                    return updatedProducts;
                });

                alertEx(res.data, function () { });

            }).catch((error) => {
                console.log('카트 상품 삭제 동작 오류');
                console.log(error);
            })
        }, function () {
            alertEx('`카트 상품` 삭제를 취소하셨습니다.', function () { });
        });
    };

    // 사용자가 `주문하기` 버튼을 클릭하였습니다.
    const makeOrder = async () => {
        // 체크 박스가 on 상태인 것만 필터링합니다.
        const selectedProducts = cartProducts.filter((bean) => bean.checked);
        if (selectedProducts.length === 0) {
            alertEx('주문할 상품을 선택해 주세요.', function () { });
            return;
        }

        const hasInvaild = selectedProducts.some(product => product.quantity === 0);
        if (hasInvaild) {
            alertEx('구매수량은 1개 이상이어야 합니다.', function () { });
            return;
        }

        const url = `${API_BASE_URL}/order`;

        // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
        // 주의) parameters 작성시 key의 이름은 OrderDto의 변수 이름과 동일하게 작성해야 합니다.
        const parameters = {
            memberId: user?.id,
            status: 'PENDING',
            orderItems: selectedProducts.map((product) => ({
                cartProductId: product.cartProductId,
                productId: product.productId,
                quantity: product.quantity,
                price: product.price
            }))
        };

        console.log('주문할 데이터 정보');
        console.log(parameters);

        await customAxios.post(url, parameters).then((res) => {

            alertEx(res.data, function () {

                // 방금 주문한 품목은 이제 장바구니 목록에서 제거되어야 합니다.
                setCartProducts((previous) =>
                    previous.filter((product) => !product.checked) // 주문한 상품 제거하기 (check 안한놈만 남아라)
                );

                setOrderTotalPrice(0); // 총 주문 금액 초기화

            });


        }).catch((error) => {
            console.log('주문 기능 실패');
            console.log(error);
            alertEx('주문기능 실패 : ' + error.response.data, function () { checkedFalse(); });
        })
    };
    const selectDel = async () => {
        // 체크 박스가 on 상태인 것만 필터링합니다.
        const selectedProducts = cartProducts.filter((bean) => bean.checked);
        if (selectedProducts.length === 0) {
            alertEx('삭제할 상품을 선택해 주세요.', function () { });
            return;
        }

        const url = `${API_BASE_URL}/cart/deleteList`;

        // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
        // 주의) parameters 작성시 key의 이름은 OrderDto의 변수 이름과 동일하게 작성해야 합니다.
        const parameters: number[] = [];

        selectedProducts.forEach((product) => {
            parameters.push(product.cartProductId);
        })


        console.log('삭제할 데이터 정보');
        console.log(parameters);

        await customAxios.delete(url, { data: parameters }).then((res) => {

            alertEx(res.data, function () {

                // 방금 주문한 품목은 이제 장바구니 목록에서 제거되어야 합니다.
                setCartProducts((previous) =>
                    previous.filter((product) => !product.checked) // 주문한 상품 제거하기 (check 안한놈만 남아라)
                );

                setOrderTotalPrice(0); // 총 주문 금액 초기화

            });

        }).catch((error) => {
            alertEx('삭제기능 실패 : ' + error.response.data, function () { checkedFalse(); });
            console.log(error);
        })
    };

    return (
        <Container className="mt-4">
            {errMsg && <Alert variant="danger">{errMsg}</Alert>}
            <h2 className="mb-4">
                {/* xxrem은 주위 글꼴의 xx배를 의미합니다. */}
                <span style={{ color: 'blue', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th style={thStyle}>
                            <Form.Check
                                type="checkbox"
                                checked={isAllCheck}
                                label="전체"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}> 카테고리</th>
                        <th style={thStyle}>재고</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>단가</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>

                <tbody>
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr key={product.cartProductId}>
                                <td className="text-center align-middle">
                                    <Form.Check
                                        type="checkbox"
                                        checked={product.checked}
                                        onChange={() => toggleCheckBox(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Nav.Link onClick={() => navigate(`/product/detail/${product.productId}`)}>
                                        <Row> {/* 좌측 4칸은 이미지 영역, 우측 8칸은 상품 이름 영역 */}
                                            <Col xs={4}>

                                                <Image
                                                    src={`${API_IMAGE_URL}/${product.image}`}
                                                    thumbnail
                                                    alt={product.name}
                                                    width={`80`}
                                                    height={`80`}
                                                />
                                            </Col>
                                            <Col xs={8} className="d-flex align-items-center">
                                                {product.name}({product.productId})
                                            </Col>
                                        </Row>
                                    </Nav.Link>
                                </td>
                                <td className="text-center align-middle">
                                    {product.category}
                                </td>
                                <td className="text-center align-middle">
                                    {product.stock}
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(event) =>
                                            changeQuantity(
                                                product.cartProductId,
                                                parseInt(event.target.value)
                                            )}
                                        style={{ width: '80px', margin: '0 auto' }}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    {product.price.toLocaleString()} 원
                                </td>
                                <td className="text-center align-middle">
                                    {(product.price * product.quantity).toLocaleString()} 원
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="danger" size="sm"
                                        onClick={() => deleteCartProduct(product.cartProductId)}
                                    >
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td>장바구니가 비어 있습니다.</td></tr>
                    )}
                </tbody>
            </Table>

            {/* 좌측 정렬(text-start), 가운데 정렬(text-center), 우측 정렬(text-end) */}
            <h3 className="text-end mt-3">총 주문 금액 : {orderTotalPrice.toLocaleString()}원</h3>
            <div className="text-end" id="cartBtn">
                <Button variant="danger" id="selDel" size="sm" onClick={selectDel}>
                    선택삭제
                </Button>
                <Button variant="primary" size="sm" onClick={makeOrder}>
                    주문하기
                </Button>
            </div>
        </Container >
    );
}

export default App;