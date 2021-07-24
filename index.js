const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser=require('body-parser')
const cors=require('cors')
const app = express()
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skhdz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json())
app.use(cors());

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("onlineLibrary").collection("books");
  const ordersCollection = client.db("onlineLibrary").collection("books");

    console.log("DATABASE Connected 100%");

    app.post("/addProduct",(req,res) => {
        const products=req.body;
        productCollection.insertOne(products)
        .then(result=>{
            console.log(result.insertedCount);
        })
    })

    app.get('/books',(req, res)=>{
      productCollection.find({})
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })

    app.delete('/delete/:id',(req, res)=>{
      const id=req.params.id;
      productCollection.deleteOne({_id: ObjectId(id)})
      .then(result=>{
        console.log(result);
      })
    })


    app.get('/books/:id',(req, res)=>{
      const id=req.params.id;
      productCollection.find({_id: ObjectId(id)})
      .toArray((err,documents)=>{
        res.send(documents[0]);
      })
    })

    app.post('/booksByKeys',(req, res)=>{
      const productsKeys=req.body;
      productCollection.find({key:{$in : productsKeys}})
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })

    app.post("/addBooks",(req,res) => {
      const order=req.body;
      ordersCollection.insertOne(order)
      .then(result=>{
          console.log(result.insertedCount);
          res.send(result.insertedCount>0);       
      })
  })



});


app.get('/', (req, res) => {
  res.send('Welcome to ema john server !')
})

app.listen(process.env.PORT || port)