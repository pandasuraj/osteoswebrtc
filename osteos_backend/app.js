const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const index = require('./routes/index');
app.use('/', index);

app.listen(5000, () => {
     console.log('server is listening on port 5000');
});
