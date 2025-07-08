const express = require('express');
const cors = require('cors');
const multer = require('multer');
const analyzeRouter = require('./routes/analyse');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/analyze', analyzeRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
