const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgjjcg0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDB').collection('product')
     //  cart server
     const cartCollection = client.db("productDB").collection("cart")
  
   app.get('/product', async(req, res) =>{
    const cursor = productCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   });

  //  update 
app.get('/product/:id', async(req, res) =>{
const id = req.params.id;
const query ={_id: new ObjectId(id)}
const result = await productCollection.findOne(query);
res.send(result);
});




    app.post('/product', async(req, res) =>{
        const newProducts = req.body;
        console.log(newProducts);
        const result = await productCollection.insertOne(newProducts);
        res.send(result);
    })

    

    // update put 

    app.put('/product/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options ={ upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name, 
          brand_name: updatedProduct.brand_name, 
          type: updatedProduct.type, 
          price: updatedProduct.price,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
          photo: updatedProduct.photo
        }
      }

      const result =await productCollection.updateOne(filter, product, options)
      res.send(result);
    })

  
   

     // GET CART
     app.get('/cart', async (req, res) => {
         const cursor = cartCollection.find();
         const result = await cursor.toArray();
         res.send(result);
     })
     // add cart
     app.post('/cart', async (req, res) => {
         const cart = req.body;
         console.log(cart);
         const result = await cartCollection.insertOne(cart);
         res.send(result);
     });

    //  delete 
   
    app.delete('/cart/:id', async(req, res) =>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
    
  
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('cosmetics server running')
})
app.listen(port, () => {
    console.log(`cosmetics server is running on port: ${port}`)
})



// food form add 
// app.get('/myAddFoodItem', async (req, res) => {
//   const cursor = foodAddCollection.find();
//   const result = await cursor.toArray();
//   res.send(result);
// });

// app.post('/myAddFoodItem', async(req, res ) => {
//   const newFood = req.body;
//   console.log(newFood);
//   const result = await foodAddCollection.insertOne(newFood);
//   res.send(result);
// })

    // update food 
    // app.get('/allfood/:id', async(req, res) =>{
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id)}
    //   const result = await foodCollection.findOne(query);
    //   res.send(result);
    // })