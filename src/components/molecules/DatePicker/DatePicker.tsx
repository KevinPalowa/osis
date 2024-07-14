import React, { useState } from "react";
import {
  View,
  Button,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const DatePicker: React.FC = ({ value, onChange }) => {
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const showMode = (currentMode: "date" | "time") => {
    setShow(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => showMode("date")}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "black",
            }}
          >
            {value ? dayjs(value).format("DD MMM YYYY") : ""}
          </Text>
        </View>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePicker;
