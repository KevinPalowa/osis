import { SafeScreen } from "@/components/template";
import { postCandidate } from "@/services/candidate";
import { getStudentsAll } from "@/services/student";
import { ApplicationScreenProps } from "@/types/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

function AddCandidate({ navigation }: ApplicationScreenProps<"AddCandidate">) {
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
  const { mutate, isPending } = useMutation({
    mutationFn: postCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
  });

  const students = data?.data ?? [];

  const onSubmit = (data: any) => {
    const body = {
      userId: data.candidate.id,
      visi: data.visi,
      misi: data.misi,
      biography: data.biography,
    };
    // Handle form submission
    mutate(body, {
      onSuccess: (response) => {
        navigation.navigate("Home");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.label}>Candidate:</Text>
        <Controller
          control={control}
          name="candidate"
          rules={{ required: "Candidate is required" }}
          render={({ field: { onChange, value } }) => (
            <SelectDropdown
              data={students}
              onSelect={(selectedItem, index) => {
                onChange(selectedItem);
              }}
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View style={[styles.input, { height: 50 }]}>
                    <Text style={{ fontSize: 16, color: "black" }}>
                      {(selectedItem && selectedItem.name) || "Select Student"}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...stylesSelect.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "grey" }),
                    }}
                  >
                    <Text style={stylesSelect.dropdownItemTxtStyle}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
              dropdownStyle={stylesSelect.dropdownMenuStyle}
              showsVerticalScrollIndicator={false}
              search
              searchInputStyle={stylesSelect.dropdownSearchInputStyle}
              searchInputTxtColor={"black"}
              searchPlaceHolder={"Search here"}
              searchPlaceHolderColor={"#eaeaea"}
            />
          )}
        />

        <Text style={styles.label}>Visi:</Text>
        <Controller
          control={control}
          name="visi"
          rules={{ required: "Visi is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.visi && <Text style={styles.error}>{errors.visi.message}</Text>}

        <Text style={styles.label}>Misi:</Text>
        <Controller
          control={control}
          name="misi"
          rules={{ required: "Misi is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.misi && <Text style={styles.error}>{errors.misi.message}</Text>}

        <Text style={styles.label}>Biografi:</Text>
        <Controller
          control={control}
          name="biography"
          rules={{ required: "biography is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.biography && (
          <Text style={styles.error}>{errors.biography.message}</Text>
        )}
        <Button
          disabled={isPending}
          title="Submit"
          color={"#0D860Dff"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
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
});

const stylesSelect = StyleSheet.create({
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dropdownMenuStyle: {
    backgroundColor: "#444444",
    borderRadius: 8,
  },
  dropdownSearchInputStyle: {},
});

export default AddCandidate;
