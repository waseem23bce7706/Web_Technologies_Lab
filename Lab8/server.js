const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection settings
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'CollegeDB';
let db;

// Connect to MongoDB
MongoClient.connect(mongoUrl)
    .then(client => {
        console.log("Connected successfully to MongoDB");
        db = client.db(dbName);
    })
    .catch(err => console.error("MongoDB connection error:", err));

// Route for the Homepage
app.get('/', (req, res) => {
    res.send(`
        <h1>ES6 & MongoDB Exercises</h1>
        <ul>
            <li><a href="/exercise1">Run Exercise 1 (Marks)</a></li>
            <li><a href="/exercise2">Run Exercise 2 (Student DB Insert)</a></li>
            <li><a href="/exercise3">Run Exercise 3 (Course Enrollment)</a></li>
        </ul>
    `);
});

// --- EXERCISE 1: Localhost API (Let, Const, Arrow Functions) ---
app.get('/exercise1', (req, res) => {
    let studentName = "Arun";
    let mark1 = 85, mark2 = 90, mark3 = 88;

    const calculateTotal = (m1, m2, m3) => m1 + m2 + m3;
    const calculateAverage = (m1, m2, m3) => (m1 + m2 + m3) / 3;

    let total = calculateTotal(mark1, mark2, mark3);
    let average = calculateAverage(mark1, mark2, mark3);

    res.send(`<h3>Student Name: ${studentName}</h3><p>Total: ${total} | Average: ${average.toFixed(2)}</p>`);
});

// --- EXERCISE 2: MongoDB Integration (Destructuring & Spread) ---
app.get('/exercise2', async (req, res) => {
    const student = { id: 101, name: "Priya", department: "CSE", marks: 92 };
    
    // Spread operator
    const updatedStudent = { ...student, grade: "A" };

    try {
        // Insert the updated student into MongoDB
        const collection = db.collection('students');
        await collection.updateOne({ id: 101 }, { $set: updatedStudent }, { upsert: true });
        
        res.send(`<h3>Student Saved to MongoDB!</h3><pre>${JSON.stringify(updatedStudent, null, 2)}</pre>`);
    } catch (err) {
        res.status(500).send("Error saving to database.");
    }
});

// --- EXERCISE 3: Classes and Promises ---
app.get('/exercise3', (req, res) => {
    class Course {
        constructor(courseName, instructor) {
            this.courseName = courseName;
            this.instructor = instructor;
        }
        getDetails() {
            return `Course: ${this.courseName}, Instructor: ${this.instructor}`;
        }
    }

    let course1 = new Course("Web Technologies", "Dr. Kumar");

    let enrollCourse = new Promise((resolve, reject) => {
        let seatsAvailable = true; // Change this to false to test rejection
        if(seatsAvailable) resolve("Enrollment Successful");
        else reject("Course Full");
    });

    enrollCourse
        .then(msg => {
            res.send(`<h3>${course1.getDetails()}</h3><p style="color:green;">${msg}</p>`);
        })
        .catch(err => {
            res.send(`<h3>${course1.getDetails()}</h3><p style="color:red;">${err}</p>`);
        });
});

// Start the localhost server
app.listen(port, () => {
    console.log(`Server is running! Open your browser and go to http://localhost:${port}`);
});