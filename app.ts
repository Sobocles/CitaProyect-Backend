import dotenv from 'dotenv';
import Server from './models/server';
require('./models/associations')

dotenv.config();

const server = new Server();

server.listen();