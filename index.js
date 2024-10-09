const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

//Database Connection with MongoDB
mongoose.connect('mongodb+srv://assignment:assignment123@cluster0.8elyp.mongodb.net/portal');


//Schema for user modal
const Users = mongoose.model('Users', {
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
    }
});

//Schema for Assignments
const Assignments = mongoose.model('Assignments', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    createDate: {
        type: Date,
        default: Date.now,
    }
});

//Creating Endpoint for Registering The User or Admin
app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = new Users({ username, password, role });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Creating Endpoint for user or admin login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'Invalid login credentials' });
        }
        const token = jwt.sign({ id: user.id }, 'secretkey');
        res.json({ user, token });
    } catch (error) {
        res.status(400).json(error);
    }
});

//Creating Endpoint for uploading assignment
app.post('/upload', async (req, res) => {
    try {
        const { userId, task, admin } = req.body;
        const  user = await Users.findOne({ username: userId, role: 'user'});
        const  adminUser = await Users.findOne({username: admin, role: 'admin'})
        if(!user){
            return res.status(400).json({ error: 'User not found'});
        }
        if(!adminUser){
            return res.status(400).json({error: 'Admin not found'});
        }
        const assignment = new Assignments({
            userId: user.id,
            task,
            admin: adminUser.id
        });
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        console.log('Error uploading assignment:', error);
        res.status(400).json(error);
    }
});

//Fetching all admins
app.get('/admins', async (req, res)=>{
    try{
        const admins = await Users.find({role: 'admin'});
        res.json(admins);
    }catch (error) {
        res.status(400).json(error);
    }
});

//Creating endpoint for assignment tagged to the admin
app.get('/assignments', async(req,res)=>{
    try{
        const assignments = await Assignments.find({ admin: req.user.id}).populate('userId', 'username');
        res.json(assignments);
    } catch (error){
        res.status(400).json(error);
    }
});

//Accept an assignment
app.post('/assignments/:id/accept', async (req, res)=>{
    try{
        const assignment = await Assignments.findById(req.params.id);

        if(!assignment){
            return res.status(404).json({error: 'Assignment not found'});
        }
        assignment.status = 'accepted';
        await assignment.save();
        res.json(assignment);
    } catch (error) {
        res.status(400).json(error);
    }
});

//Reject an assignment
app.post('/assignments/:id/reject', async (req, res)=>{
    try{
        const assignment = await Assignments.findById(req.params.id);
        if(!assignment){
            return res.status(400).json({error: 'Assignment Not found'});
        }
        assignment.status = 'rejected';
        await assignment.save();
        res.json(assignment);
    } catch (error){
        res.status(400).json(error);
    }
});


app.get('/', (req, res) => {
    res.send('Express App is running')
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});