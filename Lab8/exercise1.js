const http = require('http');
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

const server = http.createServer(async (req, res) => {
    let studentName = "Arun";
    let mark1 = 85, mark2 = 90, mark3 = 88;

    const calculateAverage = (m1, m2, m3) => {
        return (m1 + m2 + m3) / 3;
    }

    let average = calculateAverage(mark1, mark2, mark3);
    let formattedAverage = Math.trunc(average * 100) / 100;

    // Save to MongoDB
    try {
        await client.connect();
        const db = client.db('CollegeDB');
        await db.collection('marks').insertOne({
            studentName, mark1, mark2, mark3, average: formattedAverage
        });
    } catch (err) {
        console.error("Database Error:", err);
    }

    // Display exact output in browser
    let output = `Student Name: ${studentName}\nAverage Marks: ${formattedAverage}`;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(output);
});

server.listen(3001, () => {
    console.log("Exercise 1 running! Open http://localhost:3001");
});