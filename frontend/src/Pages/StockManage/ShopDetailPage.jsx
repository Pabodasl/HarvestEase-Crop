// src/Pages/ShopDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ShopDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-product/${id}`); // Adjust the API endpoint
        setProduct(response.data); // Assuming the response contains the product details
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-page">
      <header className="text-center">
        <h1 className="text-4xl font-bold">{product.name}</h1>
      </header>

      <section className="product-details">
        <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-info">
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ${product.price}</p>
          <p className="product-availability">
            {product.available ? "In Stock" : "Out of Stock"}
          </p>

          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </section>
    </div>
  );
};

export default ShopDetailPage;
