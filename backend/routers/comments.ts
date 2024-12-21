import express, { Request, Response } from "express";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

const commentsRouter = express.Router();

const newsPath = "./news";
const commentsPath = "./comments";

interface Comment {
    id: string;
    newsId: string;
    author: string;
    text: string;
    datetime: string;
}

commentsRouter.use(express.json());

commentsRouter.get("/", async (req: Request, res: Response) => {
    const { news_id } = req.query;

    try {
        await fs.mkdir(commentsPath, { recursive: true });

        const files = await fs.readdir(commentsPath);
        const allComments: Comment[] = [];

        for (const file of files) {
            const filePath = `${commentsPath}/${file}`;
            const commentContent = await fs.readFile(filePath, "utf-8");
            const comment = JSON.parse(commentContent) as Comment;

            if (!news_id || comment.newsId === news_id) {
                allComments.push(comment);
            }
        }

        res.send(allComments);
    } catch (err) {
        res.status(500).send({ error: "Failed to load comments." });
    }
});

commentsRouter.post("/", async (req: Request, res: Response) => {
    const { newsId, author = "Anonymous", text } = req.body;

    try {
        const newsFilePath = `${newsPath}/${newsId}.json`;

        await fs.access(newsFilePath);

        await fs.mkdir(commentsPath, { recursive: true });

        const commentId = uuidv4();
        const datetime = new Date().toISOString();

        const comment: Comment = {
            id: commentId,
            newsId,
            author,
            text,
            datetime,
        };

        const commentFileName = `${commentsPath}/${commentId}.json`;

        await fs.writeFile(commentFileName, JSON.stringify(comment, null, 2), "utf-8");

        res.send(comment);
    } catch (err) {
        res.status(404).send({ error: "News not found." });
    }
});

commentsRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const filePath = `${commentsPath}/${id}.json`;

    try {
        await fs.unlink(filePath);
        res.send({ message: "Comment deleted successfully." });
    } catch (err) {
        res.status(404).send({ error: "Comment not found." });
    }
});

export default commentsRouter;
