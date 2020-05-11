require('dotenv').config();

const client = require('./lib/client');

// Initiate database connection
client.connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;


app.get('/grocery_list', async(req, res) => {
  const data = await client.query('SELECT * from grocery_list');

  res.json(data.rows);
});

app.get('/grocery_list/:id', async(req, res) => {
  const id = req.params.id;
  const data = await client.query(
    'SELECT * from grocery_list WHERE id=$1', [id]);

  res.json(data.rows[0]);
});

app.post('/grocery_list/', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT INTO grocery_list (name, type, amount, owner_id, is_cheap)
      VALUES ($1, $2, $3, $4, $5)
      returning *;`,
      [req.body.name, req.body.type, req.body.amount, 1, req.body.isCheap]
    );

    res.json(data.rows[0]);
  } catch(e) {
    console.error ();
    res.json (e);
  }
});

// changed all url pathing to match front end - apicall.js

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

module.exports = app;
