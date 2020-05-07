const client = require('../lib/client');
const usersData = require('./users.js');
const groceryList = require('./grocery-list.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      groceryList.map(groceryItem => {
        return client.query(`
                    INSERT INTO grocery_list (name, amount, is_cheap, type, owner_id )
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [groceryItem.name, groceryItem.amount, groceryItem.isCheap, groceryItem.type, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
