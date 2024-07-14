import { z } from "zod";
const roleScheme = z.enum(["STUDENT", "ADMIN"]);
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  photo: z.string().nullable(),
  role: roleScheme, // You can add other roles as needed
  grade: z.string(),
  dob: z.string().nullable(),
  nisn: z.number().nullable(),
  address: z.string().nullable(),
});

export const meScheme = z.object({
  email: z.string(),
  grade: z.string(),
  id: z.number(),
  isVoted: z.boolean(),
  name: z.string(),
  role: z.enum(["STUDENT", "ADMIN"]),
});
