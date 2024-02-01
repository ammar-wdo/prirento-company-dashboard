import * as z from "zod";

const requiredString = z.string().min(1, "Required field");

const requiredNumber = z.preprocess((input) => {
  return input === "" ? undefined : Number(input);
}, z.number());

const slugSchema = requiredString
  .max(200, "Slug is too long") //
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const loginSchema = z.object({
  username: requiredString.max(20, "maximum 20 characters"),
  password: z
    .string()
    .min(2, "Password should be at least 8 chars")
    .max(20, "maximum 20 characters"),
});