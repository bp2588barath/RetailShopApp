import React,{
  useEffect,
  useState
} from "react";

import axios from "axios";

import "../../styles/orders.css";

export default function ManageOrders(){

  const [orders,setOrders] = useState([]);

  const fetchOrders = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/orders"
      );

      setOrders(res.data);

    } catch(err){

      console.log(err);

    }

  };

  useEffect(() => {

    fetchOrders();

  },[]);

  const updateStatus = async(id,status) => {

    try {

      await axios.put(

        `http://localhost:5000/api/orders/${id}`,

        { status }

      );

      fetchOrders();

    } catch(err){

      console.log(err);

    }

  };

  return(

    <div className="orders-page">

      <h1>
        Manage Orders
      </h1>

      <table>

        <thead>

          <tr>

            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order)=>(

            <tr key={order._id}>

              <td>
                {order.customerName}
              </td>

              <td>
                {order.productName}
              </td>

              <td>
                ₹ {order.totalPrice}
              </td>

              <td>
                {order.status}
              </td>

              <td>

                <button
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Shipped"
                    )
                  }
                >
                  Ship
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      order._id,
                      "Delivered"
                    )
                  }
                >
                  Deliver
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}