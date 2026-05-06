//설정파일 (backEnd url , port)

const API_HOST = 'localhost';
//const API_HOST = '192.168.0.227';   //학원 와이파이
//const API_HOST = '192.168.0.36';   //집 와이파이

const API_PORT = '9000';
const REACT_PORT = '5173';

export const REACT_BASE_URL = `http://${API_HOST}:${REACT_PORT}`;
export const API_BASE_URL = `http://${API_HOST}:${API_PORT}`;
export const API_IMAGE_URL = `http://${API_HOST}:${API_PORT}/images`;
export const API_MEMBER_URL = `http://${API_HOST}:${API_PORT}/member`;
export const API_PRODUCT_URL = `http://${API_HOST}:${API_PORT}/product`;
export const API_CART_URL = `http://${API_HOST}:${API_PORT}/cart`;

export const nav_client_id = "lkqzz1uWaGCn9UC_Xrpw";
export const nav_redirectURI = "http://localhost:5173/member/nauth";
export const nav_state = "RANDOM_STATE";

export const kko_client_id = "3c6d9d432fdac13ca5f9565cb91764c8";
export const kko_redirectURI = "http://localhost:5173/member/kauth";