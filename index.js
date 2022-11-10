const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ovb7cdl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {

        const serviceCollection = client.db('badhons-collection').collection('services');
        const reviewService = client.db('badhons-collection').collection('reviews');


        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const services = req.body;

        });



        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);


        })
        //review api

        // app.get('/reviews', async (req, res) => {
        //     console.log(req.query);
        //     const query = {};
        //     const cursor = reviewService.find(query);
        //     const review = await cursor.toArray();
        //     res.send(review);


        // });


        app.get('/reviews', async (req, res) => {


            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewService.find(query);
            const review = await cursor.toArray();
            res.send(review);


        });

        app.post('/reviews', async (req, res) => {

            const review = req.body;
            const result = await reviewService.insertOne(review);
            res.send(result);

        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewService.updateOne(query, updatedDoc);
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewService.deleteOne(query);
            res.send(result);
        })
    }


    finally {

    }

}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})