// Import packages and assign variables
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
require("./config/passport-setup");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,PUT",
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {

})
.then(() => console.log("MongoDB connection successful!"))
.catch(err => console.log(err));

// Routes
const authRouter = require("./routes/auth");
const attendancesRoutes = require('./routes/attendances');
const InventoryItemRouter = require("./routes/InventoryItems");
const ShowcaseRouter = require("./routes/Showcase");
const CartRouter = require("./routes/Cards");
const AvailableItemRouter = require("./routes/AvailableItems");
const financemanage = require("./routes/finances");
const DeliverRouter = require("./routes/Deliveries");
const UserRoute = require("./routes/userDashboard");
const EmployeeRoute = require("./routes/employeeItem");
const ReviewRouter = require("./routes/reviews");
const salaryRoutes = require('./routes/salary');
const driverRoutes = require('./routes/driverRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const giveChecksRoutes = require("./routes/giveChecksRoutes");
const inventoryAlertRoutes = require("./routes/InventoryAlertRoutes");
const OfferRouter = require("./routes/Offer");
const cropSolution = require("./routes/cropSolutions");
const bestSellingRouter = require('./routes/bestSelling');
const otherExpensesRoutes = require("./routes/otherExpensesRoutes");
const OrderRouter = require("./routes/Orders");
const PayCash = require('./routes/payCash');

// API Endpoints
app.use("/auth", authRouter);
app.use("/paycash",PayCash)
app.use("/inventoryalert", inventoryAlertRoutes);
app.use('/api/attendances', attendancesRoutes);
app.use("/offers", OfferRouter);
app.use("/api/givechecks", giveChecksRoutes);
app.use("/cropSolutions", cropSolution);
app.use('/bestSelling', bestSellingRouter);
app.use("/api/otherexpenses", otherExpensesRoutes);
app.use("/inventoryitem", InventoryItemRouter);
app.use("/showcase", ShowcaseRouter);
app.use("/card", CartRouter);
app.use("/availableitem", AvailableItemRouter);
app.use("/orders", OrderRouter);
app.use("/finance", financemanage);
app.use("/delivery", DeliverRouter);
app.use("/user", UserRoute);
app.use("/reviews", ReviewRouter);
app.use("/employee", EmployeeRoute);
app.use('/salary', salaryRoutes);
app.use('/drivers', driverRoutes);
app.use('/payments', paymentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
