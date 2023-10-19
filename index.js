const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


//middleware


app.use(cors());
app.use(express.json());

//brandMaster
//BpG6nsW5qH5yxU4s

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjvt8fn.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)  await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const myCart = client.db('productDB').collection('cart');


    app.get('/product', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    app.get('/product/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    // app.get('/product/:brand/update/:id', async (req, res) => {
    //   const brand = req.params.brand;
    //   const id = req.params.id;
    //   const query = { brand: brand, _id: new ObjectId(id) };
    //   const result = await productCollection.findOne(query);
    //   res.send(result);
    // });



    app.get('/product/:brand/update/:id', async (req, res) => {
      try {
        const brand = req.params.brand;
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID');
        }

        const query = { brand: brand, _id: new ObjectId(id) };
        const result = await productCollection.findOne(query);

        if (!result) {
          return res.status(404).send('Product not found');
        }

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });




    // app.put('/product/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const newProd = req.body;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updatedProd = {
    //     $set: {
    //       image: newProd.image,
    //       name: newProd.name,
    //       brand: newProd.brand,
    //       price: newProd.price,
    //       rating: newProd.rating,

    //       type: newProd.type,
    //     }
    //   }

    //   const result = await productCollection.updateOne(filter, updatedProd, options);
    //   res.send(result);
    // })




    app.put('/product/:id', async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID');
        }

        const newProd = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedProd = {
          $set: {
            image: newProd.image,
            name: newProd.name,
            brand: newProd.brand,
            price: newProd.price,
            rating: newProd.rating,
            type: newProd.type,
          }
        }

        const result = await productCollection.updateOne(filter, updatedProd, options);

        if (result.matchedCount === 0) {
          return res.status(404).send('Product not found');
        }

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });





    // app.get('/product/:brand/:id', async (req, res) => {
    //   const brand = req.params.brand;
    //   const id = req.params.id;
    //   const query = { brand: brand, _id: new ObjectId(id) }; 
    //   const result = await productCollection.findOne(query);
    //   res.send(result);
    // });



    app.get('/product/:brand/:id', async (req, res) => {
      try {
        const brand = req.params.brand;
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID');
        }

        const query = { brand: brand, _id: new ObjectId(id) };
        const result = await productCollection.findOne(query);

        if (!result) {
          return res.status(404).send('Product not found');
        }

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });






    app.post('/product', async (req, res) => {
      const newProd = req.body;
      const result = await productCollection.insertOne(newProd);
      res.send(result);
    })


    app.post('/cart', async (req, res) => {
      const newProd = req.body;
      const result = await myCart.insertOne(newProd);
      res.send(result);
    })



    // app.get('/cart', async (req, res) => {
    //   const cursor = myCart.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    app.get('/cart', async (req, res) => {
      const email = req.query.email; // the query parameter is named 'email'
      const query = { email: email }; // Define the query object with the email parameter
      
      const cursor = myCart.find(query); // Using the query in the find function
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get('/cart/:id',async(req,res) => {
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)};
    //   const result = await myCart.find(query).toArray();
    //   res.send(result);
    // })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCart.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();

  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('FINAL DEPLOYMENT!!');
})


app.listen(port, () => {
  console.log(`My server is running on PORT ${port}`)
})

