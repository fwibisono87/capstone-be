import express from 'express';
import { checkAuth } from './auth';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World, peko!');
});

app.get('/protected-route', checkAuth, (req, res) => {
  res.send('This route is protected');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
