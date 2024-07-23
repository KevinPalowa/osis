import React, { useState } from "react";
import Snackbar from "react-native-snackbar";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Button,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchoolsAll, postSchool, deleteSchool } from "@/services/school";
import { ListItem, Icon, Overlay, Input } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";

const Schools = () => {
  const queryClient = useQueryClient();
  const {
    data: schools,
    isLoading,
    error,
    refetch,
  } = useQuery({ queryKey: ["schools"], queryFn: getSchoolsAll });
  const [isModalVisible, setModalVisible] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");

  const addMutation = useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["schools"]);
      setModalVisible(false);
      setNewSchoolName("");
    },
    mutationFn: postSchool,
  });

  const deleteMutation = useMutation({
    onSuccess: () => queryClient.invalidateQueries(["schools"]),
    mutationFn: deleteSchool,
  });

  const handleAddSchool = () => {
    if (newSchoolName.trim()) {
      addMutation.mutate({ name: newSchoolName });
    } else {
      Alert.alert("Error", "Please enter a school name");
    }
  };

  const handleDeleteSchool = (id) => {
    Alert.alert(
      "Hapus Sekolah",
      "Apakah anda yakin ingin menghapus sekolah ini?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteMutation.mutate(id),
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading schools</Text>;
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Daftar Sekolah
      </Text>
      <FlatList
        data={schools}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <Icon name="delete" onPress={() => handleDeleteSchool(item.id)} />
          </ListItem>
        )}
      />
      <Button
        title="Tambah Sekolah"
        onPress={() => setModalVisible(true)}
        color="#0D860Dff"
      />

      <Overlay
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Tambah Sekolah</Text>
          <Input
            style={styles.input}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            placeholder="Masukan nama sekolalh"
            value={newSchoolName}
            onChangeText={setNewSchoolName}
          />

          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              width: "100%",
              gap: 10,
            }}
          >
            <Button
              color="#0D860Dff"
              title="Tambah"
              onPress={handleAddSchool}
            />
            <Button
              color="gray"
              title="Batal"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Schools;
