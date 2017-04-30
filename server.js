const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { BlogPosts } = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create("My Ramblings1", "Here I go - bar", "Roshni", 4 - 25 - 2017);
BlogPosts.create("My Ramblings2", "Here I go - foo", "Roshni", 1 - 2 - 2017);
BlogPosts.create("My Ramblings3", "Here I go - bizz", "Roshni");

app.get('/blogs', (req, res) => {
    res.json(BlogPosts.get());
});

app.post('/blogs', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const blog = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(blog);    
});

app.delete('/blogs/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog with id \`${req.params.ID}\``);
    res.status(204).end();
});

app.put('/blogs/:id',jsonParser, (req, res) => {
    const updatedBlog = BlogPosts.update({
        id:req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).json(updatedBlog);
});

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

let server;

function runServer(){
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => { 
        server = app.listen(port, () => {
            console.log(`Your app is listening at ${port}`);
            resolve(server);
            }).on('error', err =>{
                reject(err)
        })
    });
}

function closeServer(){
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

if(require.main === module) {
    runServer().catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer};