import express, {json} from 'express';
require('express-async-errors');
import cookieSession from 'cookie-session';

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';
import {errorHandler, NotFoundError} from '@michelbtickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(signinRouter);


app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};