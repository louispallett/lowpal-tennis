const asyncHandler = require("express-async-handler");

const verifyUser = require("../config/verifyUser");
const User = require("../models/user");

// As we populate this in some of our controllers, we need to import it here, even though we don't actually reference it directly!
const Category = require("../models/category");


exports.get_categories = asyncHandler(async (req, res, next) => {
    try {
        await verifyUser(req.headers.authorization);
        const user = await User.findById(req.params.userId).populate({ path: "categories" }).exec();
        const categories = user.categories.map(category => category.name);
        res.status(200).json({ categories })
        } catch (error) {
            res.sendStatus(403);
        }
});