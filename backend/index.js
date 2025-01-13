const express = require("express");
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { connect } = require('./db');
connect();

app.use(bodyParser.json())
app.use(express.json());

const mainRouter = require('./routes/index');
app.use(cors());
app.use('/api/v1', mainRouter);
const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));