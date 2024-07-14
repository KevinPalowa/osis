import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MMKV } from "react-native-mmkv";

import { ThemeProvider } from "@/theme";

import ApplicationNavigator from "./navigators/Application";
import "./translations";
import { AuthProvider } from "./hooks/useAuth/AuthProvider";
import "./sheets.tsx";
import { SheetProvider } from "react-native-actions-sheet";
import { ThemeProvider as ThemeProvideRNE } from "react-native-elements";

const queryClient = new QueryClient();

export const storage = new MMKV();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storage={storage}>
        <ThemeProvideRNE>
          <AuthProvider>
            <SheetProvider>
              <ApplicationNavigator />
            </SheetProvider>
          </AuthProvider>
        </ThemeProvideRNE>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
