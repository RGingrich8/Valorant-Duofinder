const express = require("express"); 
const mongoose = require("mongoose"); 
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require("socket.io");
const { createServer } = require('http');
const {broadcasting} = require('./sockets/broadcasting');
const cors=require("cors");

// DotEnv Configuration
dotenv.config();

// Mongo DB Configuration
const dbConfig = {
    database : process.env.MONGO_DB ?? '',
    hostname : process.env.MONGO_HOST ?? '',
    port : process.env.MONGO_PORT ?? '',
};

const connectionURI = `mongodb://${dbConfig.hostname}:${dbConfig.port}/${dbConfig.database}`
mongoose.connect(connectionURI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// App configuration
const appConfig = { port : process.env.APP_PORT ?? '5000' }

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
 }));

// Route Configuration
const userRoutes = require("./routes/users");
const filtersRoutes = require("./routes/filters");
const matchingRoutes = require("./routes/matchings");
const chatRoutes = require("./routes/chats");
const commendationRoutes = require("./routes/commendations");

app.use("/", userRoutes);
app.use("/", filtersRoutes);
app.use("/", matchingRoutes);
app.use("/", chatRoutes);
app.use("/", commendationRoutes)

// Starting the node.js server
app.listen(appConfig.port, () => {
    console.log(`Serving express server on port ${appConfig.port}`);
});

// Socket configuration

const httpServer = createServer();
const io = new Server(httpServer);

broadcasting(io); // Used for sending and receiving simple real-time messages between users.

const socketConfig = { port : process.env.SOCKET_PORT ?? '2000'}
httpServer.listen(socketConfig.port, () => {
    console.log(`Serving socket server on port ${socketConfig.port}`);
});