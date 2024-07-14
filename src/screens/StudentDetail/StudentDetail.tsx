import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.label, fonts.bold]}>Student Details</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data?.email}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data?.name}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>
            {data?.dob ? dayjs(data?.dob).format("DD MMM YYYY") : "-"}
          </Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>data Number:</Text>
          <Text style={styles.value}>{data?.nisn ?? "-"}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{data?.address ?? "-"}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Grade:</Text>
          <Text style={styles.value}>{data?.grade ?? "-"}</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  detailContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 2,
  },
});
