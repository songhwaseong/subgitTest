
import { NavDropdown, Navbar, Container, Nav } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

type MenuItemsProps = {
   appName: string;
   user: User | null;
   handleLogout: (e: React.MouseEvent<HTMLElement>) => void;
}

function MenuItems({ appName, user, handleLogout }: MenuItemsProps) {
   const navigate = useNavigate();

   const renderMenu = () => {
      switch (user?.role) {
         case 'ADMIN':
            return (
               <>
                  {user && (
                     <Nav.Item className="text-white fw-bold fs-5 me-3 d-flex align-items-center">
                        {user.name}님
                     </Nav.Item>
                  )}
                  <Nav.Link onClick={() => navigate(`/product/list`)}>상품보기</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/member/info`, { state: { email: user?.email } })}>회원 정보</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/product/insert`)}>상품 등록</Nav.Link>
                  {/* 관리자는 모든 사람의 주문 내역 확인 */}
                  <Nav.Link onClick={() => navigate(`/cart/list`)}>장바구니</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/order/list`)}>주문 내역</Nav.Link>
                  <Nav.Link onClick={handleLogout}>로그 아웃</Nav.Link>
               </>
            );
         case 'USER':
            return (
               <>
                  {user && (
                     <Nav.Item className="text-white fw-bold fs-5 me-3 d-flex align-items-center">
                        {user.name}님
                     </Nav.Item>
                  )}
                  <Nav.Link onClick={() => navigate(`/product/list`)}>상품보기</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/member/info`, { state: { email: user?.email } })}>회원 정보</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/cart/list`)}>장바구니</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/order/list`)}>주문 내역</Nav.Link>
                  <Nav.Link onClick={handleLogout}>로그 아웃</Nav.Link>
               </>
            );
         default:
            return (
               <>
                  {user && (
                     <Nav.Item className="text-white fw-bold fs-5 me-3 d-flex align-items-center">
                        {user.name}님
                     </Nav.Item>
                  )}
                  <Nav.Link onClick={() => navigate(`/product/list`)}>상품보기</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/member/login`)}>로그인</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/member/signup`)}>회원 가입</Nav.Link>
               </>
            );
      }
   };

   return (
      <Navbar bg="dark" variant="dark" expand="lg">
         <Container>
            <Navbar.Brand href="/">{appName}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  {renderMenu()}
                  {/* <NavDropdown title={`기본 연습`}>
                     <NavDropdown.Item onClick={() => navigate(`/fruit`, { state: { id: 1, name: "item" } })}>과일 1개</NavDropdown.Item>
                     <NavDropdown.Item onClick={() => navigate(`/fruitList`)}>과일 목록</NavDropdown.Item>
                     <NavDropdown.Item onClick={() => navigate(`/coffee`)}>커피 한잔</NavDropdown.Item>
                     <NavDropdown.Item onClick={() => navigate(`/coffeeList`)}>커피 목록</NavDropdown.Item>
                  </NavDropdown> */}
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar >
   );
}

export default MenuItems;