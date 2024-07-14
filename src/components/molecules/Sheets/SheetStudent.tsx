import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
} from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SelectDropdown from "react-native-select-dropdown";
import { getStudentsAll } from "@/services/student";
import { postCandidate } from "@/services/candidate";
import DatePicker from "../DatePicker/DatePicker";

function SheetStudent() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data } = useQuery({
    queryKey: ["studentsAll"],
    queryFn: getStudentsAll,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });

  const students = data?.data ?? [];

  const onSubmit = (formData: any) => {
    const body = {
      userId: formData.candidate.id,
      foto: formData.foto,
      noUrut: formData.noUrut,
      nama: formData.nama,
      tempatTanggalLahir: formData.tempatTanggalLahir,
      nisn: formData.nisn,
      kelas: formData.kelas,
      visi: formData.visi,
      misi: formData.misi,
    };
    mutate(body, {
      onSuccess: () => {
        SheetManager.hide("candidate");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <ActionSheet id="candidate">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Candidate:</Text>
        <Controller
          control={control}
          name="candidate"
          rules={{ required: "Candidate is required" }}
          render={({ field: { onChange, value } }) => (
            <SelectDropdown
              data={students}
              onSelect={(selectedItem) => onChange(selectedItem)}
              buttonTextAfterSelection={(selectedItem) => selectedItem.name}
              rowTextForSelection={(item) => item.name}
              buttonStyle={styles.dropdownButtonStyle}
              buttonTextStyle={styles.dropdownButtonTxtStyle}
              defaultButtonText="Select Candidate"
            />
          )}
        />
        {errors.candidate && (
          <Text style={styles.error}>{errors.candidate.message}</Text>
        )}

        <Text style={styles.label}>Foto:</Text>
        <Controller
          control={control}
          name="foto"
          rules={{ required: "Foto is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.foto && <Text style={styles.error}>{errors.foto.message}</Text>}

        <Text style={styles.label}>Nama:</Text>
        <Controller
          control={control}
          name="nama"
          rules={{ required: "Nama is required" }}
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

        <Text style={styles.label}>Tempat Tanggal Lahir:</Text>
        <Controller
          control={control}
          name="dob"
          rules={{ required: "NISN is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePicker value={value} onChange={onChange} />
          )}
        />
        {errors.tempatTanggalLahir && (
          <Text style={styles.error}>{errors.tempatTanggalLahir.message}</Text>
        )}

        <Text style={styles.label}>NISN:</Text>
        <Controller
          control={control}
          name="nisn"
          rules={{ required: "NISN is required" }}
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

        <Text style={styles.label}>Kelas:</Text>
        <Controller
          control={control}
          name="kelas"
          rules={{ required: "Kelas is required" }}
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

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </ActionSheet>
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
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
});

export default SheetStudent;
