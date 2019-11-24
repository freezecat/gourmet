let base = {
    basededonnee: function(callback)
    {
        const MongoClient = require('mongodb').MongoClient;
        const assert = require('assert');
        const url = 'mongodb://localhost:27017';
        const dbName = 'gourmet';
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
           
            const db = client.db(dbName);
            
             callback(MongoClient,assert,url,dbName,db);//les const à faire passer en paramètre sinon undefined dans carte.js
         
              client.close();
            });
           
           
           
          }
    }


module.exports = base;