const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration - Allow requests from frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());``

// Sample Component Data
const componentsData = {
  cpu: [
    { id: 1, name: 'Intel Core i9-13900K', price: 589 },
    { id: 2, name: 'AMD Ryzen 9 7950X', price: 549 },
    { id: 3, name: 'Intel Core i7-13700K', price: 399 }
  ],
  motherboard: [
    { id: 4, name: 'ASUS ROG Maximus Z790', price: 389 },
    { id: 5, name: 'MSI MEG Z790 ACE', price: 699 },
    { id: 6, name: 'Gigabyte Z790 Master', price: 299 }
  ],
  gpu: [
    { id: 7, name: 'RTX 4090', price: 1599 },
    { id: 8, name: 'RTX 4080', price: 1199 },
    { id: 9, name: 'RTX 4070', price: 599 }
  ],
  ram: [
    { id: 10, name: 'Corsair Vengeance 32GB', price: 129 },
    { id: 11, name: 'G.Skill Trident Z5 32GB', price: 159 },
    { id: 12, name: 'Kingston Fury Beast 32GB', price: 99 }
  ],
  storage: [
    { id: 13, name: 'Samsung 990 Pro 2TB', price: 179 },
    { id: 14, name: 'WD Black SN850X 2TB', price: 149 },
    { id: 15, name: 'Crucial P5 Plus 2TB', price: 129 }
  ],
  psu: [
    { id: 16, name: 'Corsair HX1000', price: 249 },
    { id: 17, name: 'Seasonic Focus GX 850W', price: 149 },
    { id: 18, name: 'EVGA SuperNOVA 750W', price: 99 }
  ],
  case: [
    { id: 19, name: 'Lian Li Lancool 215', price: 49 },
    { id: 20, name: 'NZXT H7 Flow', price: 149 },
    { id: 21, name: 'Corsair Crystal 570X', price: 169 }
  ]
};

// Routes
app.get('/api/components', (req, res) => {
  res.json(componentsData);
});

app.post('/api/builds', (req, res) => {
  const { name, components, totalPrice } = req.body;
  console.log('Build saved:', { name, components, totalPrice });
  res.json({ success: true, message: 'Build saved successfully' });
});

app.get('/api/builds', (req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});