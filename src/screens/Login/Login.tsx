import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Brand } from "@/components/molecules";
import { SafeScreen } from "@/components/template";
import { useTheme } from "@/theme";
import { isImageSourcePropType } from "@/types/guards/image";
import Input from "@/components/atoms/Input/Input";
import { useForm } from "react-hook-form";
import type { ApplicationScreenProps } from "@/types/navigation";
import { useAuth } from "@/hooks/useAuth/useAuth";
import SendImage from "@/theme/assets/images/send.png";
import ColorsWatchImage from "@/theme/assets/images/colorswatch.png";
import TranslateImage from "@/theme/assets/images/translate.png";
import RNPickerSelect from "react-native-picker-select";
import { useQuery } from "@tanstack/react-query";
import { getSchoolsAll } from "@/services/school"; // Import the new fetch function

function Login({ navigation }: ApplicationScreenProps<"Login">) {
  const { control, handleSubmit, setValue, watch } = useForm<{
    username: string;
    password: string;
    schoolId: number;
  }>();
  const { gutters, fonts } = useTheme();
  const { login, isLoading } = useAuth();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const {
    data: schools,
    error,
    isLoading: isFetchingSchools,
  } = useQuery({ queryKey: ["school"], queryFn: getSchoolsAll });

  if (isFetchingSchools) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching schools</Text>;

  if (
    !isImageSourcePropType(SendImage) ||
    !isImageSourcePropType(ColorsWatchImage) ||
    !isImageSourcePropType(TranslateImage)
  ) {
    throw new Error("Image source is not valid");
  }

  return (
    <SafeScreen>
      <View style={[gutters.marginTop_40]}>
        <View style={styles.logoContainer}>
          <Brand height={100} width={100} />
        </View>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Selamat Datang di</Text>
          <Text style={styles.welcomeText}>pemilihan OSIS</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Sekolah</Text>
          <RNPickerSelect
            onValueChange={(value) => setValue("schoolId", value)}
            items={
              schools?.map((school) => ({
                label: school.name,
                value: school.id,
              })) ?? []
            }
            style={pickerSelectStyles}
            placeholder={{ label: "Pilih Sekolah Anda", value: null }}
          />
          <Text style={styles.label}>Email</Text>
          <Input
            control={control}
            name="username"
            placeholder="Email"
            rules={{ required: "Tolong isi email anda" }}
            style={styles.input}
          />
          <Text style={styles.label}>Password</Text>
          <Input
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            rules={{ required: "Tolong isi password anda" }}
            style={styles.input}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: isLoading ? "gray" : "#0D860Dff" },
            ]}
            onPress={handleSubmit(login)}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3a3a3a",
  },
  subText: {
    fontSize: 14,
    color: "#777",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  label: {
    marginBottom: 8,
    color: "#333",
  },
  input: {
    color: "black",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  togglePassword: {
    marginLeft: 10,
  },
  keepLoggedInContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switch: {
    marginRight: 10,
  },
  keepLoggedInText: {
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#0D860Dff",
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#6666cc",
    textAlign: "center",
    marginVertical: 10,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#333",
  },
  signupLink: {
    color: "#6666cc",
    marginLeft: 5,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: "black",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  inputAndroid: {
    color: "black",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});

export default Login;
