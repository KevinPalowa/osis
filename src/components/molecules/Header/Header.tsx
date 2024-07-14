import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ApplicationScreenProps } from "@/types/navigation";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { storage } from "@/App";

function Header() {
  const { logout } = useAuth();
  const user = storage.getString("user")
    ? JSON.parse(storage.getString("user"))
    : null;

  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: "https://via.placeholder.com/50" }} // Replace with your profile image URL
        />
        <Text style={styles.profileName}>{user?.name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          logout();
        }}
      >
        <MaterialIcons name="logout" size={30} color={"white"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#19650C",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Header;
