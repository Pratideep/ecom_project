import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        {/* Product Details Section */}
        <div className="row g-5 align-items-center">
          <div className="col-md-6 text-center">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="img-fluid rounded shadow"
              height="300"
              width="350px"
            />
          </div>
          <div className="col-md-6">
            <h1 className="fw-bold mb-3">{product.name}</h1>
            <h4 className="text-success mb-3">
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h4>
            <p className="text-muted mb-2">
              <strong>Category:</strong> {product?.category?.name}
            </p>
            <p className="text-muted mb-2">
              <strong>Description:</strong> {product?.description}
            </p>
            {/* <p className="lead mb-4">{product.description}</p> */}

            {/* Optional Feature List */}
            <ul className="list-unstyled text-muted small mb-4">
              <li>✅ High-quality guaranteed</li>
              <li>🚚 Fast shipping & returns</li>
              <li>💳 Secure payment options</li>
            </ul>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                setCart([...cart, product]);
                localStorage.setItem("cart", JSON.stringify([...cart, product]));
                toast.success("Item Added to Cart");
              }}
            >
              <i className="bi bi-cart-plus me-2"></i> Add to Cart
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-5" />

        {/* Similar Products Section */}
        <div className="similar-products">
          <h3 className="mb-4 text-center">You might also like</h3>
          {relatedProducts.length < 1 ? (
            <p className="text-muted text-center">No similar products found</p>
          ) : (
            <div className="row g-4">
              {relatedProducts?.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <div className="card h-100 border-0 shadow-sm">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">
                        {p.description?.substring(0, 70)}...
                      </p>
                      <h6 className="text-success mt-auto">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h6>
                      <div className="mt-3 d-flex justify-content-between">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                            toast.success("Item Added to Cart");
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
