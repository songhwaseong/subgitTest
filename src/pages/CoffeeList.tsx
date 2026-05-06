import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import type { Coffee } from "../types/Coffee";
import axios from "../api/axiosInstance";

function App() {
    // <Coffee[]>는 Coffee 객체들의 배열, ([])는 초기값이 빈 배열이라는 뜻입니다.
    const [coffeeList, setCoffeeList] = useState<Coffee[]>([]); // 넘어온 커피 목록
    const url = `/product/coffee/list`;

    useEffect(() => {
        const fetchData = async (uri: string) => {
            try { // axios에 제네릭 타입 추가
                const response = await axios.get<Coffee[]>(uri);
                setCoffeeList(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData(url);
    }, []);

    return (
        <>
            <Table hover style={{ margin: '20px' }}>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>상품명</th>
                        <th>타입</th>
                        <th>단가</th>
                    </tr>
                </thead>
                <tbody>
                    {coffeeList.map((coffee, idx, coffeeList) => {
                        if (idx == coffeeList.length - 1) {
                            return <>
                                <tr key={coffee.id}>
                                    <td>{coffee.id}</td>
                                    <td>{coffee.name}</td>
                                    <td>{coffee.type}</td>
                                    <td>{coffee.price.toLocaleString()} 원</td>
                                </tr>
                                <tr key={coffeeList.length + 2}>
                                    <td colSpan={4} style={{ textAlign: 'center' }}>
                                        총 {coffeeList.length}개의 커피가 있습니다.
                                    </td>
                                </tr>
                            </>
                        } else {
                            return <tr key={coffee.id}>
                                <td>{coffee.id}</td>
                                <td>{coffee.name}</td>
                                <td>{coffee.type}</td>
                                <td>{coffee.price.toLocaleString()} 원</td>
                            </tr>
                        }
                    })
                    }
                </tbody>
            </Table >
        </>
    );
}

export default App;