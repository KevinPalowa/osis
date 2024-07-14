import { getResults } from "@/services/candidate";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Text as TextSVG } from "react-native-svg";

export default function Hasil() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["results"],
    queryFn: getResults,
  });

  const randomColor = () =>
    ("#" + ((Math.random() * 0xffffff) << 0).toString(16) + "000000").slice(
      0,
      7
    );

  const data3 = data
    ? data?.candidates
        .filter((e) => e.votes > 0)
        .map((candidate) => ({
          key: candidate.candidateId,
          value: candidate.votes,
          percentage: Math.round((candidate.votes / data?.usedVotes) * 100),
          label: candidate.candidateName,
          svg: { fill: randomColor() },
        }))
    : [];

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <TextSVG
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={20}
          stroke={"black"}
          strokeWidth={0.2}
        >
          {data.percentage} %
        </TextSVG>
      );
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Hasil Akhir Pemungutan Suara</Text>
        <PieChart
          style={{ height: 200 }}
          valueAccessor={({ item }) => item.value}
          data={data3}
          outerRadius={"100%"}
          innerRadius={10}
        >
          <Labels />
        </PieChart>
        <View style={styles.legend}>
          {data3.map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: item.svg.fill, opacity: item.svg.opacity },
                ]}
              />
              <Text style={styles.legendText}>
                {item.label + ` (${item.value})`}
              </Text>
            </View>
          ))}
          <Text style={{ color: "black" }}>
            Suara masuk: {data?.usedVotes}/{data?.totalVoters}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    backgroundColor: "#0D860Dff",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    color: "white",
    fontSize: 16,
    marginRight: "auto",
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
  resultContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  resultTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  candidateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  candidateImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  candidateName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBar: {
    marginRight: 10,
  },
  candidateProgress: {
    width: 50,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legend: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  legendText: {
    color: "black",
    fontSize: 14,
  },
});
