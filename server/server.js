require('dns').setServers(['8.8.8.8']);
require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');



const app = express();

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Using the LONG connection format to bypass DNS SRV blocks
// z3HHbV4JgneKcs0t

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log("✅ Mongo db is successfully connected"))
.catch(err => {
  console.log("FULL ERROR:");
  console.dir(err, { depth: null });
});

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
        const currentTenant = req.query.tenantId || 'tenant_acme_123'
        const transactions = await TransactionModel.find({tenantId: currentTenant}).sort({ _id: -1 });
        res.json(transactions); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST New
app.post('/api/transactions', async (req, res) => {
    try {
        const transactionData = {
            ...req.body,
            tenantId: req.body.tenantId || 'tenant_acme_123'
        }
        const newTransaction = new TransactionModel(transactionData);
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        console.error("Save Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on PORT ${PORT}`));