import express from 'express';
import { checkAuth } from './auth';

const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World, peko!');
});

app.get('/protected-route', checkAuth, (req, res) => {
  res.send('This route is protected');
});

app.post('/process-image', checkAuth, (req, res) => {
  if(!req.body.imageUrl) {
    res.status(400).send('Missing imageUrl from body, or no body');
    return
  }

  const imageUrl = req.body.imageUrl;
  res.send(`Processing image ${imageUrl}`);
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
