
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoute from './routes/userRoute.js';
import errorMiddleware from "./middleware/error.middleware.js";
const app = express();


app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.urlencoded({ extended: true}))

app.use(cookieParser());
app.use(morgan('dev'));
app.use(errorMiddleware);

app.use('/ping', function(req, res ) {
    res.send('/pong')
})
app.use('/api/v1/user', userRoute);
app.all('*', (req, res) => {
    res.status(404).send('OPPS! 404 Page Not Found')
});


export default app;