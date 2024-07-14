import { RouteProp } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";

export type TypeEnum =
  | "Absen Masuk"
  | "Absen Keluar"
  | "Istirahat"
  | "Istirahat Selesai";
export type ApplicationStackParamList = {
  Startup: undefined;
  Login: undefined;
  Students: undefined;
  AddStudents: undefined;
  AddCandidate: undefined;
  Result: undefined;
  Home: undefined;
  Detail: { id: number };
  StudentDetail: { id: number };
  Homepage: undefined;
  Camera: { type?: TypeEnum };
  Success: { type?: TypeEnum };
};


export type ApplicationScreenProps<
  K extends keyof ApplicationStackParamList = never
> = StackScreenProps<ApplicationStackParamList, K>;
