const express = require('express');
const db = require('./db');
require('dotenv').config();
const app = express();
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require("./swagger");

const corsOptions = {
  origin: 'http://localhost:5173',  //'https://startups.com', // Replace with your frontend domain
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
};

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

const userService = require('./service/UserService.js');
const authService = require('./service/auth.js');
const servicesService = require('./service/servicesService.js');
const cityService = require('./service/cityService.js');
const regionService = require('./service/regionService.js');
const categoriesService = require('./service/categoriesService.js');
const venueService = require('./service/venueService.js');
const bookingService = require('./service/bookingService.js');
const vendorService = require('./service/vendorService.js');
const dashboardService = require('./service/dashboardService.js');
const googleAuth = require('./service/googleAuth.js');
const claimService = require('./service/claimService.js');
const footerService = require('./service/footerService.js');
const packagesService = require('./service/packagesService.js');
const emailService = require('./service/emailService.js');
const profileService = require('./service/profileService.js');

// routes
app.use('/api/user', userService);
app.use('/api/auth', authService);
app.use('/api/service', servicesService);
app.use('/api/city', cityService);
app.use('/api/region', regionService);
app.use('/api/categories', categoriesService);
app.use('/api/venue', venueService);
app.use('/api/booking', bookingService);
app.use('/api/vendor', vendorService);
app.use('/api/dashboard', dashboardService);
app.use('/api/claim', claimService);
app.use('/api/footer', footerService);
app.use('/api/package', packagesService);
app.use('/api/email', emailService);
app.use("", googleAuth);
app.use('/api/profile', profileService);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Start the server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Swagger docs at http://localhost:5000/api-docs");
});
