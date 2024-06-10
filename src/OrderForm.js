// src/OrderForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderForm.css';

function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    cakes: [{ cakeType: '', message: '', quantity: 1, price: 0 }],
  });

  const [cakeOptions, setCakeOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cakes')
      .then((response) => {
        setCakeOptions(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the cakes!', error);
      });
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCakes = [...formData.cakes];
    updatedCakes[index][name] = value;

    // Update the price based on the selected cake type and quantity
    if (name === 'cakeType' || name === 'quantity') {
      const selectedCake = cakeOptions.find(cake => cake._id === updatedCakes[index].cakeType);
      if (selectedCake) {
        updatedCakes[index].price = selectedCake.price * updatedCakes[index].quantity;
      }
    }

    setFormData({ ...formData, cakes: updatedCakes });
  };

  const handleAddCake = () => {
    setFormData({ ...formData, cakes: [...formData.cakes, { cakeType: '', message: '', quantity: 1, price: 0 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', formData);
      // Display a success message or redirect the user after successful order submission
      alert('Order placed successfully!');
      setFormData({
        name: '',
        cakes: [{ cakeType: '', message: '', quantity: 1, price: 0 }],
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="order-form-container">
      <h2>Place Your Cake Order</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        {formData.cakes.map((cake, index) => (
          <div key={index} className="cake-order-group">
            <div className="form-group">
              <label htmlFor={`cakeType-${index}`}>Cake Type:</label>
              <select
                id={`cakeType-${index}`}
                name="cakeType"
                value={cake.cakeType}
                onChange={(e) => handleChange(index, e)}
                required
              >
                <option value="">Select a cake type</option>
                {cakeOptions.map((cakeOption) => (
                  <option key={cakeOption._id} value={cakeOption._id}>{cakeOption.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={`message-${index}`}>Message on Cake:</label>
              <input
                type="text"
                id={`message-${index}`}
                name="message"
                value={cake.message}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`quantity-${index}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${index}`}
                name="quantity"
                value={cake.quantity}
                onChange={(e) => handleChange(index, e)}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`price-${index}`}>Total Price:</label>
              <input
                type="text"
                id={`price-${index}`}
                name="price"
                value={cake.price}
                readOnly
                required
              />
            </div>
          </div>
        ))}
        <button type="button" className="add-cake-btn" onClick={handleAddCake}>Add Another Cake</button>
        <button type="submit" className="submit-btn">Place Order</button>
      </form>
    </div>
  );
}

export default OrderForm;
