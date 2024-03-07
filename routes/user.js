import express from 'express';
import { User, Admin, Course } from '../db';
import jwt from 'jsonwebtoken';
import { secretKey } from '../middleware/auth';
import { authenticateJwt } from '../middleware/auth';



const router= express.Router();

//User routes
router.post('/signup', async (req, res) => {  // here the types annotation of req res is already done by express cuz its in a .post() and express already defined that here req: Request, res: Response...whereas authenticatejwt is a normal general function whose args types have to be defined
  const user = req.body;
  const existingUser = await User.findOne({username:user.username});
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser= new User(user);
    await newUser.save();
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({username, password});
  if (user) {
    const token = jwt.sign({username, password}, secretKey, {expiresIn:'1h'});
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

router.get('/courses', authenticateJwt, async (req, res) => {
  const courses= await Course.find({published:true});
  res.json(courses);
});

router.post('/courses/:courseId', authenticateJwt, async (req, res) => {// req is of type any here so req.user works // req is sent as of type any from authenticatejwt 
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({username:req.user.username});//if u dont write req:any then req is by default set of type Request and a Request type doesn't have .user 
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
  const user = await User.findOne({username:req.user.username}).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;