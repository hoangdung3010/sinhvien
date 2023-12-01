// const express = require('express');
// const app = express();
// const port = 3000;
// const students = [];

// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Test API sinh vien');
// });

// app.get('/students', (req, res) => {
//     res.send('Danh sach sinh vien: \n' + JSON.stringify(students, null, 2));
// });

// app.post('/students', (req, res) => {
//     const newStudent = req.body;
//     if (!newStudent.name || !newStudent.age || !newStudent.address) {
//         return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sinh viên.' });
//     }

//     students.push(newStudent);
//     res.json({ 
//         message: 'Sinh viên đã được thêm.'/*, student: newStudent*/,
//         DevMsg:'OK!',
//         userMsg:'Thanh cong!' });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const mysql = require('mysql2'); // Thêm thư viện mysql2
const app = express();
const port = 3000;

// Kết nối đến cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',  
    user: 'root',       
    password: '123456', 
    database: 'students_db', 
});

connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối đến MySQL:', err);
    } else {
        console.log('Đã kết nối đến MySQL!');
    }
});

app.get('/', (req, res) => {
    res.send('Demo Api thông tin sinh viên.');
});

app.get('/students', (req, res) => {
    // Thực hiện truy vấn SQL để lấy danh sách sinh viên từ cơ sở dữ liệu
    connection.query('SELECT * FROM students', (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

app.post('/students', (req, res) => {
    const newStudent = req.body;

    if (!newStudent.name || !newStudent.age || !newStudent.address) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin sinh viên.' });
    }

    // Thực hiện truy vấn SQL để thêm sinh viên mới vào cơ sở dữ liệu
    connection.query('INSERT INTO students SET ?', newStudent, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            newStudent.id = result.insertId;
            res.json({ message: 'Sinh viên đã được thêm thành công', student: newStudent });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
