const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT|| 5000;

app.use(bodyParser.json());
app.use(cors());

const index = require('./routes/index');
app.use('/', index);

// app.listen(5000, () => {
//      console.log('server is listening on port 5000');
// });

app.listen(port, () => {
     console.log(`server is listening on port ${port}`);
});
