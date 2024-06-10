const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

connectDB();

const db = client.db('MugoMarbles'); 
const cakesCollection = db.collection('cakes');
const ordersCollection = db.collection('orders');

app.post('/api/orders', async (req, res) => {
  const order = { ...req.body, status: 'pending' };
  try {
    const result = await ordersCollection.insertOne(order);
    res.status(201).send(result.ops[0]);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    const ordersWithCakes = await Promise.all(
      orders.map(async (order) => {
        const cake = await cakesCollection.findOne({ _id: order.cakeType });
        return {
          ...order,
          cakeName: cake ? cake.name : 'Unknown Cake',
          cakePrice: cake ? cake.price : 0
        };
      })
    );
    res.send(ordersWithCakes);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/cakes', async (req, res) => {
  const cake = { ...req.body };
  try {
    const result = await cakesCollection.insertOne(cake);
    res.status(201).send(result.ops[0]);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create cake' });
  }
});

app.get('/api/cakes', async (req, res) => {
  try {
    const cakes = await cakesCollection.find().toArray();
    res.send(cakes);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch cakes' });
  }
});

app.delete('/api/cakes/:cakeId', async (req, res) => {
  const { cakeId } = req.params;
  try {
    const result = await cakesCollection.deleteOne({ _id: cakeId });
    if (result.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ error: 'Cake not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete cake' });
  }
});

app.patch('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const result = await ordersCollection.updateOne(
      { _id: orderId },
      { $set: { status } }
    );
    if (result.modifiedCount === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to update order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
