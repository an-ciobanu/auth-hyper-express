/*
	File with the database functionality
*/

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Setting up the config for the process envs
dotenv.config();


/**
 * connectDB
 * 
 * @param: <none>
 * 
 * Connects to a database specified in the environment
 */
const connectDB = async () => {
    try {

		//We get the uri for the DB from environemnt
        const uri = process.env.MONGODB_URI as string;

		//Basic mongo connection
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
