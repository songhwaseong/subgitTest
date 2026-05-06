import { Route, Routes } from "react-router-dom";

import HomePage from '../pages/HomePage';
import SignUpPage from '../pages/SignUpPage';
import LoginPage from '../pages/LoginPage';
import UserInfo from '../pages/UserInfo';
import ProductInsertForm from '../pages/ProductInsertForm.tsx';
import ProductUpdateForm from '../pages/ProductUpdateForm.tsx';
import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';
import type { User } from "../types/User";
import CartList from './../pages/CartList';
import OrderList from '../pages/OrderList';
import Nauth from '../pages/Nauth';
import Kauth from '../pages/Kauth';


interface AppProps {
    user: User | null;
    handleLoginSuccess: (userData: User) => void;
}

function AppRoutes({ user, handleLoginSuccess }: AppProps) {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            {/* <Route path='/fruit' element={<FruitOne />} />
            <Route path='/fruitList' element={<FruitList />} />
            <Route path='/coffee' element={<CoffeeOne />} />
            <Route path='/coffeeList' element={<CoffeeList />} /> */}
            <Route path='/member/info' element={<UserInfo />} />
            <Route path='/member/signup' element={<SignUpPage />} />
            <Route path='/member/login' element={< LoginPage onLogin={handleLoginSuccess} />} />
            <Route path='/product/list' element={<ProductList user={user} />} />
            <Route path='/product/insert' element={<ProductInsertForm user={user} />} />
            <Route path='/product/update/:id' element={<ProductUpdateForm user={user} />} />
            <Route path='/product/detail/:id' element={<ProductDetail user={user} />} />
            <Route path='/cart/list' element={<CartList user={user} />} />
            <Route path='/order/list/' element={<OrderList user={user} />} />
            <Route path='/member/nauth' element={<Nauth onLogin={handleLoginSuccess} />} />
            <Route path='/member/kauth' element={<Kauth onLogin={handleLoginSuccess} />} />
        </Routes>
    );
}

export default AppRoutes;