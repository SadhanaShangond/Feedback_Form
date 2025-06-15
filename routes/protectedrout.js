const express = require("express");
const Feedback = require("../models/feedbackModle");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
router.get("/feedback", verifyToken, (req, res) => {
  res.render("feedback"); 
});
router.post("/feedback", verifyToken, async (req, res) => {
  try {
    const feedback = new Feedback({
      user: req.userId, 
      name:req.body.name,
      course: req.body.course,
      instructor: req.body.instructor,
      rating: req.body.rating,
      comments: req.body.comments,
    });

    await feedback.save();
    res.redirect("/api/v1/protect/success");
  } catch (err) {
    console.error(err);
    res.status(400).render("error", {
      message: "Failed to submit feedback.",
      redirect: "/api/v1/protect/feedback",
    });
  }
});

router.get("/success", verifyToken, (req, res) => {
  res.render("success", { message: "Thank you for your feedback!" });
});

module.exports = router;
