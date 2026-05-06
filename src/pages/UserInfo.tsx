import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import type { User } from "../types/User";
import { useLocation } from "react-router-dom";
import axios from "../api/axiosInstance";

function App() {

    const [User, setUser] = useState<User | null>(null);
    const location = useLocation(); // 라우터 통해서 전달된 데이터 받는 훅
    let email = location.state.email;
    let url = `/api/memberInfo?email=${email}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { withCredentials: true };
                await axios.get<User>(url, config).then((response) => {
                    setUser(response.data);
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
                        <td>회원번호</td>
                        <td>{User?.id}</td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>{User?.name}</td>
                    </tr>
                    <tr>
                        <td>이메일</td>
                        <td>{User?.email}</td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>{User?.address}</td>
                    </tr>
                    {User?.addressDetail &&
                        <tr>
                            <td>상세 주소</td>
                            <td>{User?.addressDetail}</td>
                        </tr>
                    }
                    <tr>
                        <td>가입일</td>
                        <td>{User?.regdate}</td>
                    </tr>
                    <tr>
                        <td>직원여부</td>
                        <td>{User?.role === 'ADMIN' ? '예' : '아니오'}</td>
                    </tr>
                </tbody>
            </Table >
        </>
    )
}
export default App;