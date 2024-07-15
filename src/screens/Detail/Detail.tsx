import { storage } from "@/App";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { deleteCandidate, getCandidate, postVote } from "@/services/candidate";
import { ApplicationScreenProps } from "@/types/navigation";
import { meScheme } from "@/types/schemas/user";
import { NavigationContainer } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Detail({
  navigation,
  route,
}: ApplicationScreenProps<"Detail">) {
  const id = route.params.id;
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const user = storage.getString("user")
    ? JSON.parse(storage.getString("user"))
    : null;
  const { data } = useQuery({
    queryKey: ["candidate", id],
    queryFn: () => getCandidate(id),
  });

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: postVote,
  });

  const { mutate: doDelete } = useMutation({
    mutationFn: deleteCandidate,
  });
  console.log(
    !user?.isVoted && user?.role === "STUDENT",
    user?.isVoted,
    user?.role === "STUDENT"
  );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultContainer}>
        <Image
          style={styles.candidateImage}
          source={{
            uri: data?.user.photo
              ? data?.user.photo
              : "https://static.vecteezy.com/system/resources/previews/004/991/321/original/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
          }} // Replace with your profile image URL
        />
        <Text style={styles.resultTitle}>{data?.user?.name}</Text>
        <Text style={styles.candidateName}>VISI: {data?.visi ?? "-"}</Text>
        <Text style={[styles.candidateName, { marginTop: 10 }]}>
          MISI: {data?.misi ?? "-"}
        </Text>
        <Text style={[styles.candidateName, { marginTop: 10 }]}>
          Biografi: {data?.biography ?? "-"}
        </Text>
      </View>
      {!user?.isVoted && user?.role === "STUDENT" && (
        <View style={styles.buttonContainer}>
          <Button
            title="Pilih"
            color="#0D860Dff"
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
      )}
      {user?.role === "ADMIN" && (
        <View style={styles.buttonContainer}>
          <Button
            title="Hapus"
            color="red"
            onPress={() => {
              doDelete(
                id,

                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["candidates"],
                    });
                    navigation.navigate("Home");
                  },
                }
              );
            }}
          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Perhatian, apakah anda yakin ingin memilih kandidat ini?
            </Text>
            <MaterialIcons name="error" size={90} color={"#D10606"} />
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#A7B3C6",
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
                onPress={handleModalClose}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: !isPending ? "#0D860Dff" : undefined,
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
                disabled={isPending}
                onPress={() => {
                  mutate(id, {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["results"],
                      });
                      storage.set(
                        "user",
                        JSON.stringify({ ...user, isVoted: true })
                      );
                      handleModalClose();
                    },
                    onError: (err) => {
                      console.log(err);
                    },
                  });
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Yakin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  resultContainer: {
    padding: 20,
    // backgroundColor: "white",
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // elevation: 5,
  },
  resultTitle: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
  },
  candidateImage: {
    width: "auto",
    height: 300,
  },
  candidateName: {
    color: "black",
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },

  buttonContainer: {
    padding: 20,
    // alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    gap: 30,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
