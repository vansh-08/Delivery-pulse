import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import 'dotenv/config';

// Then use it in /auth/login and /auth/callback
// if (!config) return res.status(500).send("OAuth client not ready");
import { config, initMicrosoftClient, client } from './config/oauth.js';

import connectDB from './config/db.js';
// import { initMicrosoftClient } from './config/oauth.js';
import isAuthenticated from './middleware/auth.js';

import dsrRoutes from './routes/dsrRoutes.js'
import projectRoutes from './routes/projectRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import reportRoutes from './routes/reports.js';
import Employee from './models/Employee.js';
import resourceRoutes from './routes/resourceRoutes.js';


const app = express();

// Connect to DB
connectDB();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax"
  }
}));

// Initialize OAuth client
initMicrosoftClient();

// Public routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delivery Pulse API is running',
    timestamp: new Date().toISOString()
  });
});

// OAuth Routes
app.get("/auth/login", async (req, res) => {
  if (!config) return res.status(500).send("OAuth client not ready");

  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  
  req.session.code_verifier = code_verifier;

  const authUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: `${req.protocol}://${req.get('host')}/auth/callback`,
    scope: "openid profile email",
    code_challenge,
    code_challenge_method: "S256",
  });

  res.redirect(authUrl.href);
});

app.get("/auth/callback", async (req, res) => {
    if (!config) return res.status(500).send("OAuth client not ready");
  try {
    // const callbackUrl = new URL(req.url, `http://${req.headers.host}`);
    const callbackUrl = new URL(req.url, `${req.protocol}://${req.get('host')}`);

    const tokenSet = await client.authorizationCodeGrant(
      config,
      callbackUrl,
      { 
        pkceCodeVerifier: req.session.code_verifier
      }
    );

    const userInfo = await client.fetchUserInfo(config, tokenSet.access_token, tokenSet.claims().sub);

    // Find or create employee
    let employee = await Employee.findOne({ email: userInfo.email });
    
    if (!employee) {
      // Auto-create employee from OAuth data
      employee = new Employee({
        name: userInfo.name,
        email: userInfo.email,
        designation: 'Employee', // Default designation
        department: 'General',   // Default department
        isActive: true
      });
      await employee.save();
      console.log(`✅ New employee created: ${employee.name} (${employee.email})`);
    }

    // Store user info AND employee_id in session
    req.session.user = {
      name: userInfo.name,
      email: userInfo.email,
      employee_id: employee._id.toString(),
      designation: employee.designation
    };

    req.session.save((err) => {
      if (err) return res.status(500).send("Session save failed");
      res.redirect(process.env.FRONTEND_URL + '/dsr');
    });

  } catch (err) {
    console.error("OAuth Error:", err);
    if (err.response) {
      try {
        const body = await err.response.json();
        console.error("Microsoft Error Details:", body);
      } catch { }
    }
    res.redirect(process.env.FRONTEND_URL + '/login?error=auth_failed');
  }
});


//Upload Excel file
app.use('/api/resources', resourceRoutes);


app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(process.env.FRONTEND_URL + '/login');
  });
});

// Get current user info
app.get("/auth/user", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delivery Pulse API is running',
    timestamp: new Date().toISOString()
  });
});

// Protected API routes
app.use('/api/dsrs', isAuthenticated, dsrRoutes);
app.use('/api/projects', isAuthenticated, projectRoutes);
app.use('/api/employees', isAuthenticated, employeeRoutes);
app.use('/api/reports', isAuthenticated, reportRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;