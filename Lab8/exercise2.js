const http = require('http');
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

const server = http.createServer(async (req, res) => {
    const student = {
        id: 101,
        name: "Priya",
        department: "CSE",
        marks: 92
    };

    const {id, name, department, marks} = student;
    let output1 = `${id} ${name} ${department} ${marks}`;

    const updatedStudent = {
        ...student,
        grade: "A"
    };
    
    // Save updatedStudent to MongoDB
    try {
        await client.connect();
        const db = client.db('CollegeDB');
        await db.collection('students').insertOne(updatedStudent);
    } catch (err) {
        console.error("Database Error:", err);
    }

    // Display exact output in browser
    let output2 = `{ id: ${updatedStudent.id}, name: '${updatedStudent.name}', department: '${updatedStudent.department}', marks: ${updatedStudent.marks}, grade: '${updatedStudent.grade}' }`;

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`${output1}\n${output2}`);
});

server.listen(3002, () => {
    console.log("Exercise 2 running! Open http://localhost:3002");
});