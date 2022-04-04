import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

mongoose.connect('mongodb://localhost/facebook', (err) => {
    if (!err)
        console.log("Prisijungimas pavyko");
})

const postsSchema = new mongoose.Schema({
    content: String,
    data: Date
});

const posts = mongoose.model('posts', postsSchema);

app.get('/', (req, res) => {
    posts.find((err, data) => {
        if (err)
            return console.log(err)
        res.json({ data: data });
    })
})

app.post('/save-data', (req, res) => {
    const newPost = new posts();
    newPost.content = req.body.content;
    newPost.data = req.body.data;
    newPost.save();
    res.json('New data saved');
})

app.delete('/delete-data/:id', (req, res) => {
    let id = req.params.id;
    posts.findByIdAndDelete(id).exec();
    posts.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data);
    })
})

app.put('/edit-data/:id', (req, res) => {
    let id = req.params.id;
    let post = posts.findByIdAndUpdate(id, {
        content: req.body.content,
        data: req.body.data
    })
        .then(data => {
            res.json(data);
        })
})


app.listen('3005');