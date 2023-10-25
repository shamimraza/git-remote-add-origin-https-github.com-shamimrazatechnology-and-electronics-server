const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());

// password: 
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fpwjd4.mongodb.net/?retryWrites=true&w=majority`;
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

        const brandCollection = client.db('brandDb').collection('brand')
        const productCollection = client.db('brandDb').collection('product')

        app.post('/brands', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await brandCollection.insertOne(newProduct);
            res.send(result)
        })

        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        // product collection
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            console.log(newProducts);
            const result = await productCollection.insertOne(newProducts);
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // http://localhost:5000/brand-product/${params.brand}

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        app.get('/product/:brandName', async (req, res) => {
            const brand = req.params.brandName;
            const result = await productCollection.find({ name: brand }).toArray();
            res.send(result);
        })

        // user related api

        // app.post('/products', async (req, res) => {
        //     const products = req.body;
        //     console.log(products);
        //     const result = await productCollection.insertOne(products)
        //     res.send(result)
        // })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Technology and Electronics server is running')
})

app.listen(port, () => {
    console.log(`Technology and Electronics is running on port: ${port}`);
})