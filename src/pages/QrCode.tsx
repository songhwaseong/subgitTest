
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { API_BASE_URL, REACT_BASE_URL } from "../config/config";

function App(product: Product) {
    const [image, setImage] = useState('');

    useEffect(() => {
        const url = `${REACT_BASE_URL}/product/detail/` + product.id;
        setImage(`${API_BASE_URL}/qr/generate?text=${encodeURIComponent(url)}`);
    }, [product.id]);

    return (
        <>
            {image && <div style={{ textAlign: 'center', marginLeft: '170px' }}><img src={image} alt="QR Code" /></div>}
        </>
    );
}

export default App;