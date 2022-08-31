const app = require('./app');
import { PORT } from './config';
const logger = require('./utils/logger');

//Define Routes
app.get('/', (req, res) => {
  res.send('Welcome to StartHub...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  logger.log({
    level: 'info',
    message: `\nServer Listening on port ${PORT} !!!`,
  })
);
