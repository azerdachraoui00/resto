require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const reviewRoute = require("./routes/reviewRoute");


const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(
  cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/reviews/", express.static(__dirname + "/reviews/"));
app.use(express.static("/reviews/"));
app.use("/api/users", userRoutes);
app.use("/api/review", reviewRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
