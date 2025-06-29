import { connectToDB } from "@/lib/db";
import generator from "generate-password";
import HttpError from "@/lib/HttpError";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const PutValidation = z.string().trim().email().max(100);

export async function PUT(req:NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const parsed = PutValidation.safeParse(body.email);
        if (!parsed.success) throw new HttpError(parsed.error.message, 400);
        const userEmail = parsed.data;

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            throw new HttpError("No user has been found with this email", 401);
        }

        
        const newPassword = generator.generate({
            length: 15,
            numbers: true,
            symbols: true,
            exclude: "'\"`;_@,.-{}[]~#\\|¬",
            strict: true
        });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await User.updateOne(
            { _id: user._id },
            { password: hashedPassword }
        );

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_PROVIDER,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

        const mailOptions = {
            from: `"Tennis Tournament Creator" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset",
            text: `Hi ${user.firstName},
                \n\nYour password has been reset to ${newPassword}.
                \n\nPlease view this only as a temporary password - once you log in, you can change set your password via the Account page (which you can find in the top right corner).`,
            html: `<p>Hi <strong>${user.firstName}</strong>,</p>
                <p>Your password has been reset to <strong>${newPassword}</strong>.</p>
                <p>Please view this only as a temporary password - once you log in, you can change set your password via the Account page (which you can find in the top right corner).</p>`,
        };

        await transporter.sendMail(mailOptions);

        return new NextResponse(null, { status: 204 });  
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
} 