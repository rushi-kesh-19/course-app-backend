import express from 'express';
const app = express();
import cors from 'cors';
import mongoose from 'mongoose';
app.use(cors());
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';

app.use(express.json());// app.use is a middleware function whose path if not defined, gets executed on every request recieved by server.
//express.json extracts the JSON payload from the request body and transforms it into a JavaScript object, making it accessible in the subsequent middleware or route handlers as req.body.

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

mongoose.connect('mongodb+srv://rushi_kesh219:LTKoScWlvofsGz8h@cluster0.5hvsu8b.mongodb.net/courses', { dbName: "courses"});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  })
  






