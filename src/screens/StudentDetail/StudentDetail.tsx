import React from "react";
import { Image, View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeScreen } from "@/components/template";
import { useTheme } from "@/theme";
import { ApplicationScreenProps } from "@/types/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/student";
import dayjs from "dayjs";

export default function StudentDetail({
  route,
}: ApplicationScreenProps<"StudentDetail">) {
  const { id } = route.params;
  const { gutters, fonts } = useTheme();

  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });
  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultContainer}>
        <Image
          style={styles.candidateImage}
          source={{
            uri: data?.photo
              ? data?.photo
              : "https://static.vecteezy.com/system/resources/previews/004/991/321/original/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
          }} // Replace with your profile image URL
        />
        <Text style={styles.resultTitle}>{data?.name}</Text>
        <Text style={styles.candidateName}>Email: {data?.email ?? "-"}</Text>
        <Text style={[styles.candidateName, { marginTop: 10 }]}>
          Tanggal Lahir:{" "}
          {data?.dob ? dayjs(data?.dob).format("DD MMM YYYY") : "-"}
        </Text>

        <Text style={[styles.candidateName, { marginTop: 10 }]}>
          NISN:
          {data?.nisn ?? "-"}
        </Text>
        <Text style={[styles.candidateName, { marginTop: 10 }]}>
          Alamat:
          {data?.address ?? "-"}
        </Text>

        <Text style={[styles.candidateName, { marginTop: 10 }]}>
          Kelas:
          {data?.grade ?? "-"}
        </Text>
      </View>
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
