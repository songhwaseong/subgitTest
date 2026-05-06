import { useState, useEffect } from "react";
import type { Fruit } from "../types/Fruit";
import { Table } from "react-bootstrap";
import axios from "../api/axiosInstance";

function App() {

    const [fruit, setFruit] = useState<Fruit | null>(null);
    let url = `/product/fruit`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { withCredentials: true };
                await axios.get<Fruit>(url, config).then((response) => {
                    setFruit(response.data)
                });
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
                        <td>{fruit?.id}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{fruit?.name}</td>
                    </tr>
                    <tr>
                        <td>단가</td>
                        <td>{fruit?.price.toLocaleString()}원</td>
                    </tr>
                </tbody>
            </Table >
        </>
    )
}
export default App;