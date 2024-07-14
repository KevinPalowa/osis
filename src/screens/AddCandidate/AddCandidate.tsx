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
              // defaultValueByIndex={8} // use default value by index or default value
              // defaultValue={{title: 'kiss', icon: 'emoticon-kiss-outline'}} // use default value by index or default value
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
                      ...stylesSelect.dropdown1ItemStyle,
                      ...(isSelected && { backgroundColor: "grey" }),
                    }}
                  >
                    <Text style={stylesSelect.dropdown1ItemTxtStyle}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
              dropdownStyle={stylesSelect.dropdown1MenuStyle}
              showsVerticalScrollIndicator={false}
              search
              searchInputStyle={stylesSelect.dropdown1SearchInputStyle}
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

        <Text style={styles.label}>Biography:</Text>
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
  container: {
    flex: 1,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 116,
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 90,
    backgroundColor: "#E9ECEF",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 16,
  },
  headerTxt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#151E26",
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    height: 150,
  },
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
    color: "#151E26",
    textAlign: "center",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  ////////////// dropdown1
  dropdown1ButtonStyle: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#B1BDC8",
  },
  dropdown1ButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  dropdown1ButtonArrowStyle: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  dropdown1ButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: "#FFFFFF",
  },
  dropdown1MenuStyle: {
    backgroundColor: "#444444",
    borderRadius: 8,
  },
  dropdown1ItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdown1ItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dropdown1ItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: "#FFFFFF",
  },
  ////////////// dropdown2
  dropdown2ButtonStyle: {
    width: "80%",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#B1BDC8",
  },
  dropdown2ButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdown2ButtonArrowStyle: {
    fontSize: 28,
  },
  dropdown2ButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdown2MenuStyle: {
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  dropdown2ItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdown2ItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdown2ItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdown1SearchInputStyle: {},
});
export default AddCandidate;
