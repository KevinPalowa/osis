import { getStudentsAll, postStudent } from "@/services/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeScreen } from "@/components/template";
import { ApplicationScreenProps } from "@/types/navigation";
import DatePicker from "@/components/molecules/DatePicker/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as ImagePicker from "react-native-image-picker";

const studentSchema = z.object({
  foto: z.string({ required_error: "Foto is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  nama: z.string({ required_error: "Nama is required" }),
  dob: z.date({ required_error: "Tanggal Lahir is required" }), // Adjust the type based on DatePicker component output
  nisn: z.string({ required_error: "NISN is required" }),
  address: z.string({ required_error: "Address is required" }),
  kelas: z.string({ required_error: "Kelas is required" }),
});

type StudentFormData = z.infer<typeof studentSchema>;

/**
 * Converts an object into FormData.
 * @param {Object} data - The data object to convert.
 * @returns {FormData} - The resulting FormData object.
 */
function convertObjectToFormData(data) {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof File || data[key] instanceof Blob) {
      formData.append(key, data[key], data[key].name);
    } else {
      formData.append(key, data[key]);
    }
  });

  return formData;
}

function AddStudents({ navigation }: ApplicationScreenProps<"AddStudents">) {
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: postStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });

  const onSubmit = (formData: StudentFormData) => {
    const body = {
      photo: {
        uri: fotoUri,
        type: "image/jpeg", // or the appropriate MIME type
        name: "photo.jpg",
      },
      name: formData.nama,
      email: formData.email,
      dob: formData.dob.toISOString(),
      address: formData.address,
      nisn: formData.nisn,
      grade: formData.kelas,
      role: "STUDENT",
    };

    mutate(convertObjectToFormData(body), {
      onSuccess: () => {
        navigation.navigate("Students");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setFotoUri(response.assets[0].uri || null);
        setValue("foto", response.assets[0].uri || "");
      }
    });
  };

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Foto:</Text>
        <View style={styles.photoContainer}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.photo} />
          ) : (
            <TouchableOpacity
              onPress={handleChoosePhoto}
              style={styles.photoPlaceholder}
            >
              <Text>Choose Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        {errors.foto && <Text style={styles.error}>{errors.foto.message}</Text>}

        <Text style={styles.label}>Email:</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Text style={styles.label}>Nama:</Text>
        <Controller
          control={control}
          name="nama"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.nama && <Text style={styles.error}>{errors.nama.message}</Text>}

        <Text style={styles.label}>Tanggal Lahir:</Text>
        <Controller
          control={control}
          name="dob"
          render={({ field: { onChange, value } }) => (
            <DatePicker value={value} onChange={onChange} />
          )}
        />
        {errors.dob && <Text style={styles.error}>{errors.dob.message}</Text>}

        <Text style={styles.label}>NISN:</Text>
        <Controller
          control={control}
          name="nisn"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.nisn && <Text style={styles.error}>{errors.nisn.message}</Text>}

        <Text style={styles.label}>Alamat:</Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.address && (
          <Text style={styles.error}>{errors.address.message}</Text>
        )}

        <Text style={styles.label}>Kelas:</Text>
        <Controller
          control={control}
          name="kelas"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.kelas && (
          <Text style={styles.error}>{errors.kelas.message}</Text>
        )}

        <Button
          disabled={isPending}
          title="Submit"
          onPress={handleSubmit(onSubmit)}
          color={"#0D860Dff"}
        />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
});

export default AddStudents;
