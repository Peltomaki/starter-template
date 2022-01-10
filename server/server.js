require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
app.use(helmet());
// let corOptions = {
//   origin: 'http://localhost:8080',
//   credentials: true,
//   maxAge: 3600,
// };

app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//testing api
app.get('/', (req, res) => {
  res.json({ message: 'hello from api' });
});

//port
const PORT = process.env.PORT || 5003;

const models = require('./models');
//Sync database
models.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine');
});
// Add routes to API cals
//Api routes

app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/storage', require('./routes/userRoutes'));
app.use('/api/v1/servicess', require('./routes/serviceRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
