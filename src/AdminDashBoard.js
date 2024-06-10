/* src/AdminDashboard.js */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [cakes, setCakes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCake, setNewCake] = useState({
    name: '',
    price: 0,
  });
  const [showOrders, setShowOrders] = useState(false); // State to manage orders visibility

  useEffect(() => {
    axios.get('http://localhost:5000/api/cakes')
      .then((response) => {
        setCakes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the cakes!', error);
      });

    axios.get('http://localhost:5000/api/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the orders!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCake({ ...newCake, [name]: value });
  };

  const handleAddCake = () => {
    axios.post('http://localhost:5000/api/cakes', newCake)
      .then((response) => {
        setCakes([...cakes, response.data]);
        setNewCake({ name: '', price: 0 });
      })
      .catch((error) => {
        console.error('There was an error adding the cake!', error);
      });
  };

  const handleDeleteCake = (cakeId) => {
    axios.delete(`http://localhost:5000/api/cakes/${cakeId}`)
      .then(() => {
        setCakes(prevCakes => prevCakes.filter(cake => cake._id !== cakeId));
      })
      .catch((error) => {
        console.error('There was an error deleting the cake!', error);
      });
  };

  const handleCompleteOrder = (orderId) => {
    axios.patch(`http://localhost:5000/api/orders/${orderId}`, { status: 'completed' })
      .then(() => {
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'completed' } : order
        ));
      })
      .catch((error) => {
        console.error('There was an error completing the order!', error);
      });
  };

  const getCakeName = (cakeType) => {
    const cake = cakes.find(cake => cake._id === cakeType);
    return cake ? cake.name : 'Unknown Cake';
  };

  const pendingOrders = orders.filter(order => order.status !== 'completed');

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="cakes-list">
        <h3>Cakes List</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cakes.map((cake) => (
                <tr key={cake._id}>
                  <td>{cake.name}</td>
                  <td>${cake.price}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteCake(cake._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M19 6h-4l-1-1H10L9 6H5v2h14V6zM7 18v-8h10v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zm9-4H8v-6h8z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="add-cake-form">
        <h3>Add New Cake</h3>
        <div className="input-group">
          <input
            type="text"
            name="name"
            value={newCake.name}
            onChange={handleChange}
            placeholder="Cake Name"
            className="input-field"
          />
          <input
            type="number"
            name="price"
            value={newCake.price}
            onChange={handleChange}
            placeholder="Cake Price"
            className="input-field"
          />
          <button onClick={handleAddCake} className="add-cake-button">Add Cake</button>
        </div>
      </div>
      <button onClick={() => setShowOrders(!showOrders)} className="toggle-orders-button">
        {showOrders ? 'Hide Orders' : 'Show Orders'}
      </button>
      {showOrders && (
        <div className="orders-list">
          <h3>Orders List</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cake Type</th>
                  <th>Message</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  order.cakes.map((cake, index) => (
                    <tr key={`${order._id}-${index}`}>
                      {index === 0 && <td rowSpan={order.cakes.length}>{order.name}</td>}
                      <td>{getCakeName(cake.cakeType)}</td>
                      <td>{cake.message}</td>
                      <td>{cake.quantity}</td>
                      <td>${cake.price}</td>
                      <td>
                        <button onClick={() => handleCompleteOrder(order._id)} disabled={order.status === 'completed'}>
                          {order.status === 'completed' ? 'Completed' : 'Complete Order'}
                        </button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
