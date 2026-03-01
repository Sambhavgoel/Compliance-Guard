const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Using the LONG connection format to bypass DNS SRV blocks
// z3HHbV4JgneKcs0t

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌", err.message));

// --- SCHEMA & MODEL ---
const transactionSchema = new mongoose.Schema({
    vendor: { type: String, required: true },
    amount: { type: Number, required: true }, 
    date: { type: String, required: true },
    status: { type: String, required: true },
    tenantId: { type: String, default: 'tenant_acme_123' }
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

// --- API ROUTES ---

// GET All
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await TransactionModel.find().sort({ _id: -1 });
        res.json(transactions); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST New
app.post('/api/transactions', async (req, res) => {
    try {
        const newTransaction = new TransactionModel(req.body);
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on PORT ${PORT}`));