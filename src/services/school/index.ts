import { instance } from "@/services/instance";
import { schoolSchema } from "@/types/schemas/school";
import { z } from "zod";

const getSchoolsAll = async () => {
  const response = await instance.get(`schools`).json();
  return z.array(schoolSchema).parse(response);
};

const postSchool = async (body: { name: string }) => {
  const response = await instance
    .post(`schools`, {
      json: body,
    })
    .json();
  return schoolSchema.parse(response);
};

const deleteSchool = async (id: number) => {
  const response = await instance.delete(`schools/${id}`).json();
  return response;
};
const getSchool = async (id: number) => {
  const response = await instance.get(`schools/${id}`).json();
  return z.object({ data: schoolSchema }).parse(response).data;
};

export { getSchoolsAll, postSchool, getSchool, deleteSchool };
