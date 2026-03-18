const http = require('http');
const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

const server = http.createServer(async (req, res) => {
    class Course {
        constructor(courseName, instructor) {
            this.courseName = courseName;
            this.instructor = instructor;
        }
        displayCourse() {
            return `Course: ${this.courseName}, Instructor: ${this.instructor}`;
        }
    }

    let course1 = new Course("Web Technologies", "Dr. Kumar");
    let courseOutput = course1.displayCourse();

    let enrollCourse = new Promise((resolve, reject) => {
        let seatsAvailable = true;
        if(seatsAvailable) resolve("Enrollment Successful");
        else reject("Course Full");
    });

    try {
        let msg = await enrollCourse;
        
        // Save enrollment to MongoDB
        await client.connect();
        const db = client.db('CollegeDB');
        await db.collection('enrollments').insertOne({
            course: course1.courseName,
            instructor: course1.instructor,
            status: msg
        });

        // Display exact output in browser
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`${courseOutput}\n${msg}`);
    } catch (err) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`${courseOutput}\n${err}`);
    }
});

server.listen(3003, () => {
    console.log("Exercise 3 running! Open http://localhost:3003");
});