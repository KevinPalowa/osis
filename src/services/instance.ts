import { storage } from "@/App";
import { useNavigation } from "@react-navigation/native";
import ky from "ky";
import Snackbar from "react-native-snackbar";

// const prefixUrl = `http://10.0.2.2:3000/`;
// const prefixUrl = `https://osis-be-production.up.railway.app/`;
const prefixUrl = `https://artistic-perception-production.up.railway.app/`;

export const instance = ky.extend({
  prefixUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = storage.getString("token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status >= 400 && response.status < 500) {
          const responseBody = await response.json();
          const error = new Error(responseBody.error || "Client error");
          error.response = response;
          Snackbar.show({ text: responseBody.error, backgroundColor: "red" });
          throw error;
        }
        if (response.status === 401) {
          console.log("lahhhh");
        }
      },
    ],
  },
  // headers: {
  //   Accept: "application/json",
  // },
});
