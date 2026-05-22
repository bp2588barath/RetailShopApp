import React, {
  useState,
  useEffect
} from "react";

import axios from "axios";

import "../../styles/admin.css";

export default function Dashboard() {

  /* PRODUCTS */

  const [products, setProducts] = useState([]);

  /* FORM */

  const [formData, setFormData] = useState({

    name: "",
    price: "",
    image: ""

  });

  /* EDITING */

  const [editingId, setEditingId] =
    useState(null);

  /* FETCH PRODUCTS */

  const fetchProducts = async () => {

    try {

      const res = await axios.get(

        "http://localhost:5000/api/products"

      );

      setProducts(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  /* LOAD */

  useEffect(() => {

    fetchProducts();

  }, []);

  /* HANDLE INPUT */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  /* ADD PRODUCT */

  const addProduct = async () => {

    if (
      !formData.name ||
      !formData.price ||
      !formData.image
    ) {

      alert("Fill all fields");

      return;

    }

    try {

      await axios.post(

        "http://localhost:5000/api/products",

        formData

      );

      alert("Product Added");

      fetchProducts();

      setFormData({

        name: "",
        price: "",
        image: ""

      });

    } catch (err) {

      console.log(err);

    }

  };

  /* DELETE PRODUCT */

  const deleteProduct = async (id) => {

    try {

      await axios.delete(

        `http://localhost:5000/api/products/${id}`

      );

      alert("Product Deleted");

      fetchProducts();

    } catch (err) {

      console.log(err);

    }

  };

  /* EDIT PRODUCT */

  const editProduct = (product) => {

    setEditingId(product._id);

    setFormData({

      name: product.name,
      price: product.price,
      image: product.image

    });

  };

  /* UPDATE PRODUCT */

  const updateProduct = async () => {

    try {

      await axios.put(

        `http://localhost:5000/api/products/${editingId}`,

        formData

      );

      alert("Product Updated");

      fetchProducts();

      setEditingId(null);

      setFormData({

        name: "",
        price: "",
        image: ""

      });

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2>Retail Admin</h2>

        <ul>

          <li>Dashboard</li>

          <li>Products</li>

          <li>Orders</li>

          <li>Customers</li>

          <li>Analytics</li>

          <li>Logout</li>

        </ul>

      </div>

      {/* MAIN */}

      <div className="main-content">

        {/* TOPBAR */}

        <div className="topbar">

          <h1>Admin Dashboard</h1>

          <input
            type="text"
            placeholder="Search Products..."
          />

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <h2>{products.length}</h2>

            <p>Total Products</p>

          </div>

          <div className="stat-card">

            <h2>120+</h2>

            <p>Orders</p>

          </div>

          <div className="stat-card">

            <h2>₹2.5L</h2>

            <p>Revenue</p>

          </div>

          <div className="stat-card">

            <h2>85+</h2>

            <p>Customers</p>

          </div>

        </div>

        {/* ADD / UPDATE PRODUCT */}

        <div className="add-product-section">

          <h2>

            {
              editingId
                ? "Update Product"
                : "Add New Product"
            }

          </h2>

          <div className="form-grid">

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />

          </div>

          <button

            onClick={
              editingId
                ? updateProduct
                : addProduct
            }

          >

            {
              editingId
                ? "Update Product"
                : "Add Product"
            }

          </button>

        </div>

        {/* PRODUCTS */}

        <div className="product-section">

          <h2>Manage Products</h2>

          <div className="product-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product._id}
              >

                <img
                  src={product.image}
                  alt={product.name}
                />

                <h3>{product.name}</h3>

                <p>₹ {product.price}</p>

                {/* EDIT BUTTON */}

                <button
                  className="edit-btn"
                  onClick={() =>
                    editProduct(product)
                  }
                >

                  Edit Product

                </button>

                {/* DELETE BUTTON */}

                <button
                  onClick={() =>
                    deleteProduct(product._id)
                  }
                >

                  Delete Product

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}