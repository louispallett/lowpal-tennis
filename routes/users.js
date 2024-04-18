const express = require('express');
const router = express.Router();

router.get('/sign-up', (req, res, next) => {
  res.render('user-signing/sign-up', { title: 'Sign Up' });
});

router.get("/sign-in", (req, res, next) => {
  res.render("user-signing/sign-in", { title: "Sign In" });
})

module.exports = router;
