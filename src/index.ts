import express from 'express';
import { checkAuth } from './auth';
import { fetchImage, HTTPError } from './utils';

const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World, peko!');
});

app.get('/protected-route', checkAuth, (req, res) => {
  res.send('This route is protected');
});

app.post('/process-image', checkAuth, async (req, res) => {
  if (!req.body.imageUrl) {
    res.status(400).send('Missing imageUrl from body, or no body');
    return;
  }

  const imageUrl = req.body.imageUrl;
  try {
    const fetch_res = await fetchImage(imageUrl);
    res.send(`Processing image ${imageUrl}`);
  } catch (error) {
    if (error instanceof HTTPError) {
      // Send the error status and message from HTTPError
      res.status(error.status).send(error.message);
    } else {
      // For any other errors, send a generic server error
      res.status(500).send('Internal Server Error');
    }
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
