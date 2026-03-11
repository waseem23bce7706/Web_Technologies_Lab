const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB(){

    await client.connect();

    db = client.db("book_finder_db");

    console.log("MongoDB Connected");

    const booksCollection = db.collection("books");

    const count = await booksCollection.countDocuments();

    if(count === 0){

        await booksCollection.insertMany([
        {
        title:"JavaScript Essentials",
        author:"John Smith",
        category:"Programming",
        price:450,
        rating:4.5,
        year:2023
        },
        {
        title:"Python Basics",
        author:"Mike Ross",
        category:"Programming",
        price:400,
        rating:4.2,
        year:2022
        },
        {
        title:"Machine Learning Guide",
        author:"David Kim",
        category:"AI",
        price:700,
        rating:4.8,
        year:2023
        },
        {
        title:"Data Science Intro",
        author:"Anna Lee",
        category:"Data",
        price:600,
        rating:4.7,
        year:2024
        },
        {
        title:"React Development",
        author:"Chris Evans",
        category:"Programming",
        price:550,
        rating:4.4,
        year:2023
        },
        {
        title:"AI Fundamentals",
        author:"Tom Hardy",
        category:"AI",
        price:650,
        rating:4.1,
        year:2024
        }
        ]);

        console.log("Sample books inserted");

    }
}

connectDB();

/* SEARCH BOOK BY TITLE */

app.get("/books/search", async (req,res)=>{

    const title = req.query.title;

    const books = await db.collection("books").find({
        title: { $regex:title , $options:"i" }
    }).toArray();

    res.send(books);
});


/* FILTER BY CATEGORY */

app.get("/books/category/:category", async (req,res)=>{

    const category = req.params.category;

    const books = await db.collection("books").find({
        category: category
    }).toArray();

    res.send(books);
});


/* SORT BOOKS */

app.get("/books/sort/:type", async (req,res)=>{

    const type = req.params.type;

    let sortOption = {};

    if(type === "price") sortOption = {price:1};

    if(type === "rating") sortOption = {rating:-1};

    const books = await db.collection("books")
    .find()
    .sort(sortOption)
    .toArray();

    res.send(books);
});


/* TOP RATED BOOKS */

app.get("/books/top", async (req,res)=>{

    const books = await db.collection("books")
    .find({rating:{$gte:4}})
    .limit(5)
    .toArray();

    res.send(books);
});


/* PAGINATION */

app.get("/books", async (req,res)=>{

    const page = parseInt(req.query.page) || 1;

    const limit = 5;

    const books = await db.collection("books")
    .find()
    .skip((page-1)*limit)
    .limit(limit)
    .toArray();

    res.send(books);
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
