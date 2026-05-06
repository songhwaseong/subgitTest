import { useEffect, useState } from "react";
import type { Fruit } from "../types/Fruit";
import { Table } from "react-bootstrap";
import axios from "../api/axiosInstance";

function App() {

    const [fruitList, setFruitList] = useState<Fruit[]>([]);
    const url = `/product/fruitList`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get<Fruit[]>(url).then((response) => {
                    console.log(response.data);
                    setFruitList(response.data);
                });
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);
    return (
        <>
            <Table hover style={{ margin: '20px' }}>
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>상품명</th>
                        <th>단가</th>
                    </tr>
                </thead>
                <tbody>
                    {fruitList.map((fruit) => (
                        <tr key={fruit.id}>
                            <td>{fruit.id}</td>
                            <td>{fruit.name}</td>
                            <td>{fruit.price.toLocaleString()} 원</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3} className="text-center">총 {fruitList.length}개의 과일이 있습니다.</td>
                    </tr>
                </tbody>
            </Table >
        </>
    )
}

export default App;