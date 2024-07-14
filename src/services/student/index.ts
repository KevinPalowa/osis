import { instance } from "@/services/instance";
import { userSchema } from "@/types/schemas/user";
import { z } from "zod";

const getStudents = async (queryParams?: {
  page: number;
  limit: number;
  name?: string;
}) => {
  const response = await instance
    .get(`users`, { searchParams: queryParams })
    .json();
  return z
    .object({
      data: z.array(userSchema),
      meta: z.object({
        total: z.number(),
        page: z.string(),
        limit: z.string(),
        totalPages: z.number(),
      }),
    })
    .parse(response);
};

const getStudentsAll = async () => {
  const response = await instance.get(`users/all`).json();
  return response;
};

const postStudent = async (body: FormData) => {
  const response = await instance
    .post(`users`, {
      body,
    })
    .json();
  return response;
};

const getUser = async (id: number) => {
  const response = await instance.get(`users/${id}`).json();
  return z.object({ data: userSchema }).parse(response).data;
};

export { getStudents, getStudentsAll, postStudent, getUser };
