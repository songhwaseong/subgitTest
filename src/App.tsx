import './App.css'

//외부 컴포넌트 import
import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';
import { useEffect, useState } from 'react';
import type { User } from './types/User';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_MEMBER_URL } from './config/config';

function App() {
  const appName = 'IT Academy Coffee Shop';

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loginUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (typeof loginUser === "string") {
      const parsed = JSON.parse(loginUser);   //json 문자열을 객체로 변환하여 상태에 저장
      setUser(parsed);
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const tokenChk = async () => {
      await axios.post(`${API_MEMBER_URL}/tokenChk`, {}, config).then((response) => {
      }).catch((error) => {
        console.log(error);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })
    }
    token && tokenChk();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    //localStorage.setItem("user", JSON.stringify(userData)); //json 객체를 문자열로 변환하여 저장
    console.log("로그인 성공:", userData);
  }

  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    console.log("로그아웃 성공");
    navigate("/member/login");
  };

  return (
    <>
      <MenuItems appName={appName} user={user} handleLogout={handleLogout} />
      <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} />
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p>&copy; 2025 {appName}. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;