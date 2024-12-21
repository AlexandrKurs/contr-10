import express from "express";
import cors from "cors";
import newsRouter from "./routers/news";
import commentsRouter from "./routers/comments";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/news', newsRouter);
app.use("/comments", commentsRouter);

const run = async () => {

    app.listen(port, () => {
        console.log(`Server started on port http://localhost:${port}`);
    });
};

run().catch(err => console.log(err));