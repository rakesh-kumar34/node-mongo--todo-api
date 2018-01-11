const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDB Server');
  } else {
    console.log('Connected to MongoDB Server');

    let db = client.db('TodoApp');
    db.collection('Todos').insertOne({
      text: 'Complete Project',
      completed: false
    }, (err, result) => {
      if (err) {
        console.log('Unable to insert todo', err);
      }
      else {
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    });
  }

  client.close();
});
