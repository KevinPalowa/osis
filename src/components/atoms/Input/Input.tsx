import { useController } from "react-hook-form";
import type { UseControllerProps } from "react-hook-form";
import { Text, TextInput } from "react-native";

export default function Input(
  props: UseControllerProps<any> & React.ComponentProps<typeof TextInput>
) {
  const { field, fieldState } = useController(props);
  const errorMessage = fieldState.error?.message;
  return (
    <>
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        placeholderTextColor={errorMessage && "red"}
        style={{
          borderWidth: 1,
          borderRadius: 20,
          borderColor: errorMessage && "red",
          padding: 10,
          marginBottom: 10,
          width: "100%",
          color:'black'
        }}
        {...props}
      />
      {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
    </>
  );
}
