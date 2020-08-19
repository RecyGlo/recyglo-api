const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const glob = require('glob');
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
// const formidable = require('express-formidable');
const config = require("./config/config");

const app = express();

const authRouter = require("./routes/auth");
const reportRouter = require("./routes/reports");
const userRouter = require("./routes/users");
const organizationRouter = require("./routes/organizations");
const binRouter = require("./routes/bins");
const productRouter = require("./routes/products");
const binOrderRouter = require("./routes/binOrders");
const logisticsRouter = require("./routes/logistics");
const trainingRouter = require("./routes/trainings");
const serviceRouter = require("./routes/services");
const paymentRouter = require("./routes/payment");
const quizRouter = require("./routes/quiz");
const userAnsQuizRouter = require("./routes/userAnsQuiz");
const trainingSlideRouter = require("./routes/trainingSlide");
const carbonfootprintRouter = require("./routes/carbonfootprint");

// eslint-disable-next-line no-var
var tokenList = {};
module.exports = tokenList;

// DB Config
const dbURI = config.db;

// Connect to MongoDB
const db = mongoose.connection;

db.on("connecting", () => {
  console.log("connecting to MongoDB...");
});
db.on("error", (error) => {
  console.error(`Error in MongoDb connection: ${error}`);
  mongoose.disconnect();
});
db.on("connected", () => {
  console.log("MongoDB connected!");
});
db.once("open", () => {
  console.log("MongoDB connection opened!");
});
db.on("reconnected", () => {
  console.log("MongoDB reconnected!");
});
db.on("disconnected", () => {
  console.log("MongoDB disconnected!");
  mongoose.connect(dbURI, {
    auto_reconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
});

mongoose.connect(dbURI, {
  auto_reconnect: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// Global variables
global.appRoot = path.resolve(__dirname); // Set project root globally
global.api = "/api/v1";
global.models = `${global.appRoot}/models`;
global.controllers = `${global.appRoot}/controllers`;

// CORS
app.use(cors());

// HTTP Logger
app.use(logger("dev"));

// Express body parser
// app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/*+json' }));
// app.use(bodyParser.text({ type: 'text/html' }));
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(formidable());

// routes
app.use("/", authRouter);
app.use("/reports", reportRouter);
app.use("/users", userRouter);
app.use("/organizations", organizationRouter);
app.use("/bins", binRouter);
app.use("/products", productRouter);
app.use("/bin_orders", binOrderRouter);
app.use("/logistics", logisticsRouter);
app.use("/trainings", trainingRouter);
app.use("/services", serviceRouter);
app.use("/payment", paymentRouter);
app.use("/quiz", quizRouter);
app.use("/user_ans_quiz", userAnsQuizRouter);
app.use("/training_slide", trainingSlideRouter);
app.use("/carbonfootprint", carbonfootprintRouter);

// 404
app.all("*", (req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res) => {
  res.status(500).json({ message: "Something went wrong!", error: err });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serving on port ${port}`);
});
