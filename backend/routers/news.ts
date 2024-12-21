import express from "express";
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const newsRouter = express.Router();

const path = './news';
const commentsPath = './comments';

interface News {
    id: string;
    title: string;
    content: string;
    datetime: string;
    image?: string;
}

newsRouter.get('/', async (_req, res) => {
    await fs.mkdir(path, { recursive: true });

    const files = await fs.readdir(path).catch(err => {
        throw err;
    });

    const allNews: Omit<News, 'content'>[] = [];

    for (const file of files) {
        const filePath = path + '/' + file;
        const newsContent = await fs.readFile(filePath);
        const { id, title, datetime, image } = JSON.parse(newsContent.toString()) as News;
        allNews.push({ id, title, datetime, image });
    }

    res.send(allNews.slice(-5).reverse());
});

newsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const filePath = `${path}/${id}.json`;

    try {
        const newsContent = await fs.readFile(filePath);
        const news = JSON.parse(newsContent.toString()) as News;
        res.send(news);
    } catch (err) {
        res.status(404).send({ error: "News not found." });
    }
});

newsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const filePath = `${path}/${id}.json`;

    try {
        await fs.unlink(filePath);

        const commentFiles = await fs.readdir(commentsPath).catch(() => []);
        for (const commentFile of commentFiles) {
            if (commentFile.startsWith(id)) {
                await fs.unlink(`${commentsPath}/${commentFile}`);
            }
        }

        res.send({ message: "News and related comments deleted successfully." });
    } catch (err) {
        res.status(404).send({ error: "News not found." });
    }
});

newsRouter.post('/', async (req, res) => {
    const { title, content, image } = req.body;

    await fs.mkdir(path, { recursive: true });

    const dateOfPost = new Date().toISOString();
    const id = uuidv4();

    const newsFileContent: News = {
        id,
        title,
        content,
        datetime: dateOfPost,
        image
    };

    const newsFileName = path + '/' + id + '.json';

    await fs.writeFile(newsFileName, JSON.stringify(newsFileContent)).catch(err => {
        throw err;
    });

    res.send(newsFileContent);
});

export default newsRouter;
