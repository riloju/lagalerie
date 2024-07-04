const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(cors());
app.use('/gallery', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/gallery')));

app.get('/', (req, res) => {
    res.send(` 
        <h1> <a style = "color: #403936; text-decoration: none;" href="http://localhost:8080/gallery"> / La Galarie </a> </h1>
        <p style = "text-align: center"> Make a gallery, be a curator. </p>
        <p style = "text-align: center"> Don't find your style? Just create it. </p>
        <br /> <br /> 
        <img style = "display: block; width:300px; height:420px;" src="http://localhost:8080/1639643692785-a37140a5-1197-421a-8baf-437fa72fae01_.jpg"> 
        <br /> <br /> <br />
        <p> 2024-??? R </p>
        </img>
        `);
})

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/img', (req, res) => {
    const galleryPath = path.join(__dirname, 'public/gallery');
    fs.readdir(galleryPath, (err, files) => {
        if(err) {
            return console.error(`ERROR: \n ${err}`);
        }
        const images = files.map(file => `http://localhost:${PORT}/${file}`);
        res.json(images);
    })
})

app.listen(PORT, () => {
    console.log(`
Running on port ${PORT}
http://localhost:8080            
`)        
        
});

module.exports = app;
