import { storage } from "@/App";
import { instance } from "@/services/instance";
import { userSchema } from "@/types/schemas/user";
import ky from "ky";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import { z } from "zod";
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (data: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const extendedUserSchema = userSchema.extend({
  isVoted: z.boolean(),
});
type User = z.infer<typeof extendedUserSchema>;
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    storage.getBoolean("isLoggedIn") ?? false
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(
    storage.getString("user") ? JSON.parse(storage.getString("user")!) : null
  );

  useEffect(() => {
    const user = storage.getString("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [storage.getString("user")]);
  const login = async (data: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      const resp: { token: string; data: any } = await instance
        .post("login", {
          json: { email: data.username, password: data.password },
        })
        .json();
      storage.set("isLoggedIn", true);
      storage.set("token", resp.token);
      setIsLoggedIn(true);
      storage.set("user", JSON.stringify(resp.data));
      setIsLoading(false);
      setUser(resp.data);
      return true;
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Invalid credentials",
        "Please ensure your username and password are correct and try again"
      );
      return false;
    }
  };

  const logout = () => {
    storage.set("isLoggedIn", false);
    setIsLoggedIn(false);
    storage.delete("user");
    storage.delete("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
