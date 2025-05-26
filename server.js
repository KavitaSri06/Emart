const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const userRoutes = require('./routes/users'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ SERVE STATIC FRONTEND
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
