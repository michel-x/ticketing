import express, {json} from 'express';
require('express-async-errors');
import cookieSession from 'cookie-session';
import {errorHandler, NotFoundError, currentUser} from '@michelbtickets/common';
import {deleteOrderRouter} from './routes/delete';
import {indexOrderRouter} from './routes/index';
import {showOrderRouter} from './routes/show';
import {newOrderRouter} from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: false,
  // secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};