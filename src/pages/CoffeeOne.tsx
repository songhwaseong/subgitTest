
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import type { Coffee } from "../types/Coffee";
import axios from "../api/axiosInstance";

function App() {
    const [coffee, setCoffee] = useState<Coffee | null>(null);
    const url = `/product/coffee?id=` + (Math.floor(Math.random() * 4) + 1);

    useEffect(() => {
        const fetchData = async () => {
            try { // axios에 제네릭 타입 추가
                const response = await axios.get<Coffee>(url);
                setCoffee(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Table hover style={{ margin: '20px' }}>
                <tbody>
                    <tr>
                        <td>아이디</td>

                        {/* optional chaining은 객체가 null 또는 undefined일 때 오류 없이 접근하도록 하는 자바 스크립트 문법입니다.*/}
                        {/* optional chaining : fruit가 null → 아무것도 안 나옴(undefined 반환), fruit가 존재 → id 출력 */}
                        <td>{coffee?.id}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{coffee?.name}</td>
                    </tr>
                    <tr>
                        <td>타입</td>
                        <td>{coffee?.type}</td>
                    </tr>
                    <tr>
                        <td>단가</td>
                        <td>{coffee?.price.toLocaleString()}원</td>
                    </tr>
                </tbody>
            </Table >
        </>
    );
}

export default App;