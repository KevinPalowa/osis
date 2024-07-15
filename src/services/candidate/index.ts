import { instance } from "@/services/instance";
import {
  addCandidateBodyScheme,
  candidateSchema,
  candidatesSchema,
  resultSchema,
} from "@/types/schemas/candidate";
import { z } from "zod";

const getCandidates = async () => {
  const response = await instance.get(`candidates`).json();
  return candidatesSchema.parse(response);
};

const getCandidate = async (id: number) => {
  const response = await instance.get(`candidates/${id}`).json();
  return candidateSchema.parse(response);
};

const postCandidate = async (body:z.infer<typeof addCandidateBodyScheme>) => {
  const response = await instance.post(`candidate`, { json: body }).json();
  return response;
};

const getResults = async () => {
  const response = await instance.get(`results`).json();
  return resultSchema.parse(response);
};

const postVote = async (candidateId: number) => {
  const response = await instance
    .post(`votes`, { json: { candidateId } })
    .json();
  return response;
};

const deleteCandidate = async (id: number) => {
  const response = await instance.delete(`candidates/${id}`).json();
  return response;
};

export {
  getCandidates,
  getResults,
  postVote,
  postCandidate,
  getCandidate,
  deleteCandidate,
};
