import e from 'express';
import express from 'express';
import { signup } from '../controllers/auth.controller.js';
const router = express.Router();

// Signup route
router.post("/signup", signup); 

// Login route
router.get("/login", (req, res) => {
  res.send("Login endpoint");
});
router.get("/logout", (req, res) => {
  res.send("Logout endpoint");
});


export default router;