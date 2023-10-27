require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const notFoundMiddleware = require('./middlewares/not-founded')
const errorMiddleware = require('./middlewares/error')

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const PORT = process.env.PORT || '5000';
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));