const express = require('express');
const router = express.Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up', { title: 'Sign Up' });
});

router.get("/sign-in", (req, res, next) => {
  res.render("sign-in", { title: "Sign In" });
})

module.exports = router;
