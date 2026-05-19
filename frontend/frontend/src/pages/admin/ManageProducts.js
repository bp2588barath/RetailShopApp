import React, { useEffect, useState } from "react";
import API from "../../services/api";

function ManageProducts() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      alert("Product Added Successfully");
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        imageUrl: "",
      });

      fetchProducts();
    } catch (err) {
      alert("Error adding product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      alert("Product Deleted");
      fetchProducts();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* Add Product Form */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Product</h3>

        <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="border p-2 rounded"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />

          <input
            className="border p-2 rounded"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            className="border p-2 rounded"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <input
            className="border p-2 rounded md:col-span-2"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="border p-2 rounded md:col-span-2"
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 md:col-span-2">
            Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Product List</h3>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{p.price} | Stock: {p.stock} | {p.category}
                  </p>
                </div>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;