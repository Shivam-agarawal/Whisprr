import express from 'express'; 
const router = express.Router();

// Get all messages
router.get("/send", (req, res) => {
  res.send("Send message endpoint");
});

export default router;