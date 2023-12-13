import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './ProductDetail.css';
import getUnAuth from '~/API/getUnAuth';
import { FaArrowRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
const ProductDetail = ({ addToCart }) => {
    const location = useLocation();
    const [productItem, setProductItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [start, setStart] = useState(0);
    const showNextImages = () => {
        const totalImages = productItem.imageSet.length;
        const imagesToShow = 3;
        setStartIndex((prevIndex) => (prevIndex + imagesToShow < totalImages ? prevIndex + 1 : 0));
    };

    const showPrevImages = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleimg = (index) => {
        setStart(index);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const id = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
                const response = await getUnAuth(`product-information/${id}`);
                if (!response) {
                    throw new Error('Network response was not ok');
                }
                setProductItem(response);
                setStart(response.imageSet.find((e) => e.is_main === true).id);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // console.log(productItem);
    return (
        <>
            <div className="product-detail-container">
                <div className="product-image-container">
                    <div className="main-image">
                        {productItem.imageSet && productItem.imageSet.length > 0 && (
                            <img
                                src={productItem.imageSet.find((e) => e.id === start).url}
                                alt=""
                                className="product-image"
                            />
                        )}
                    </div>
                    <div className="product-img">
                        <button className="iconimg" onClick={showPrevImages} disabled={startIndex === 0}>
                            <FaArrowLeft />
                        </button>
                        &nbsp;&nbsp;
                        <div className="thumbnail-images">
                            {productItem.imageSet &&
                                productItem.imageSet
                                    .slice(startIndex, startIndex + 3)
                                    .map((image, index) => (
                                        <img
                                            key={startIndex + index}
                                            src={image.url}
                                            alt={`Product ${productItem.id} - Thumbnail ${startIndex + index + 1}`}
                                            className="thumbnail-image"
                                            onClick={() => handleimg(startIndex + index)}
                                        />
                                    ))}
                        </div>
                        <button
                            className="iconimg"
                            onClick={showNextImages}
                            disabled={startIndex >= (productItem.imageSet?.length || 0) - 1}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
                <div className="product-info-container">
                    <h2 className="product-name">{productItem.name}</h2>
                    <p className="product-price">${productItem.price}</p>
                    <p className="product-description">{productItem.detail}</p>
                    <p className="product-attribute">
                        <strong>Attribute:</strong> {productItem.attribute}
                    </p>
                    <p className="product-brand">
                        <strong>Brand:</strong> {productItem.brand}
                    </p>
                    <p className="product-quantity">
                        <strong>Quantity:</strong> {productItem.quantity}
                    </p>
                    <p className="product-size">
                        <strong>Size:</strong>
                        {productItem.sizes &&
                            productItem.sizes.map((size, index) => (
                                <button className="sort" key={index}>
                                    {size.name}
                                </button>
                            ))}
                    </p>
                    <button onClick={() => addToCart(productItem)} className="add-to-cart-button">
                        Thêm vào giỏ hàng
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button onClick={() => addToCart(productItem)} className="add-to-cart-button">
                        Mua ngay
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
