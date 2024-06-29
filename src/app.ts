/*
	File for the app function that starts the server
*/

import { Server } from 'hyper-express';

import UserRouter from './user/user.controller';


export default async function() {
	const app = new Server();

	app.use('/', UserRouter);

	return app;
}