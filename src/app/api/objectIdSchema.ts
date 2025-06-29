import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().trim().refine(
    (v) => mongoose.Types.ObjectId.isValid(v),
    { message: "Invalid ObjectId" }
);

export default objectIdSchema;
