
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
app.use(morgan('dev'));

import userRoute from './routes/userRoute.js';
import errorMiddleware from "./middleware/error.middleware.js";
import courseRoute from './routes/courseRoute.js';


app.use(errorMiddleware);

app.use('/ping', function(req, res) {
  res.send('/pong')
})
app.use('/api/v1/user', userRoute);
app.use("/api/v1/courses", courseRoute);
app.all('*', (req, res) => {
  res.status(404).send('OPPS! 404 Page Not Found')
});


export default app;
