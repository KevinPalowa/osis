import { registerSheet } from "react-native-actions-sheet";
import SheetCandidate from "./components/molecules/Sheets/SheetCandidate";
import SheetStudent from "./components/molecules/Sheets/SheetStudent";

registerSheet("candidate", SheetCandidate);
registerSheet("student", SheetStudent);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    candidate: any;
    student: any;
  }
}

export {};
