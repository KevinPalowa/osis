import { z } from "zod";
import { userSchema } from "./user";

export const candidateSchema = z.object({
  id: z.number(),
  userId: z.number(),
  visi: z.string().nullable(),
  misi: z.string().nullable(),
  biography: z.string().nullable(),
  user: userSchema,
});

export const candidatesSchema = z.array(candidateSchema);

export const candidatResulteSchema = z.object({
  candidateId: z.number(),
  candidateName: z.string(),
  votes: z.number(),
});

export const resultSchema = z.object({
  totalVoters: z.number(),
  usedVotes: z.number(),
  candidates: z.array(candidatResulteSchema),
});

export const addCandidateBodyScheme = candidateSchema.omit({
  id: true,
  user: true,
});
