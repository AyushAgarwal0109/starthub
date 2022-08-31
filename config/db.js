import mongoose from 'mongoose';
import { DB_URL } from './index';
import logger from '../utils/logger';

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(DB_URL, opts);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  logger.log('info', 'Database Connected...');
});

const dbs = () => {
  try {
    (mongoose.profile = mongoose.createConnection(DB_URL + 'profile', opts)),
      (mongoose.auth = mongoose.createConnection(DB_URL + 'auth', opts));
  } catch (err) {
    console.log(err);
  }
};

const createDbs = async () => {
  return await dbs();
};

createDbs();

export default mongoose;
