const Category = require("../../models/category");
const transporter = require("../../config/nodemailerConfig");

const sendConfirmationEmail = (user, categoryNames) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "2024 Saltford In-House Tennis Tournament",
        text: `Hi ${user.firstName}, 
            \nThanks you for signing up to the 2024 Saltford In-House Tournament. This email confirms that your sign up in the following categories:
            \n${categoryNames}
            \nTeams and matches will be announced on Friday 26th July. Until then, please feel free to reply to this email with any questions you have.
            \nBest wishes,\nLouis`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            throw new Error("Send mail error: Code UA0001: " + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
}

const addUserToCategories = async (userId, userCategories) => {
    try {
        for (const userCategory of userCategories) {
            await Category.findByIdAndUpdate(
                userCategory,
                { $push: { players: userId } },
                { new: true, useFindAndModify: false } // Ensures we get the updated document back and avoid deprecation warnings
            );
        }
    } catch (error) {
        console.log(error);
        throw new Error("Code UA0001: " + error);
    }
}

const sendResetPasswordEmail = (user, newPassword) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "2024 Saltford In-House Tennis Tournament",
        text: `Hi ${user.firstName}, 
            \nThanks you for requesting to reset your password.
            \nYour password has been reset to: ${newPassword}
            \nIf you wish to change your password, please login to your account with your new password and navigate to the account settings via the site menu.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            throw new Error("Send mail error: Code UA0001: " + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

// Note that we have to pass in the req.body.email here because the user.email will 
// be the old one (since the fetch request to the database was made before updating
// the email there)
const sendUpdateEmailEmail = (user, newEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: "LowPal Tennis: Email Updated",
        text: `Hi ${user.firstName},
            \nThank you for requesting a change to your email address. This email confirms that you have updated your address to ${newEmail}.
            \nIf you did not make this request, please respond to this email immediately and let us know.
            \nBest wishes,
            Louis`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            throw new Error("Send mail error: Code UA0001: " + error);
        } else {
            console.log("Email send: " + info.response);
        }
    })
}

const sendUpdatePasswordEmail = (user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "LowPal Tennis: Reset password confirmation",
        text: `Hi ${user.firstName},
            \nYou are receieving this email because a successful request was made to reset your password.
            \nIf you did not make this request, please respond this to email immediately.`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            throw new Error("Send mail error: Code UA0001: " + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = { sendConfirmationEmail, addUserToCategories, sendResetPasswordEmail, sendUpdateEmailEmail, sendUpdatePasswordEmail };