const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());


const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TODO';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

// API endpoints
app.post('/add', async (req, res) => {
    const { task } = req.body;
    try {
        const newTask = await TodoModel.create({ task });
        res.json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

app.get('/get', async (req, res) => {
    try {
        const tasks = await TodoModel.find();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTask = await TodoModel.findByIdAndUpdate(
            id,
            { done: true },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to edit task' });
    }
});

app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    try {
        const updatedTask = await TodoModel.findByIdAndUpdate(
            id,
            { task },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await TodoModel.findByIdAndDelete(id);
        res.json(deletedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = app;
