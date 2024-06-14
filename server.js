const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware to serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Route to upload files
app.post('/upload', upload.array('files'), (req, res) => {
    res.json({ files: req.files.map(file => file.filename) });
});

// Route to list uploaded files
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan directory: ' + err);
        } else {
            res.json(files);
        }
    });
});

// Route to download a file
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

app.listen(port, () => {
    console.log(`Server is running on http://172.20.10.11:${port}`);
});
