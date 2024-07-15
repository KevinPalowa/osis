import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ApplicationScreenProps } from "@/types/navigation";
import { getCandidates } from "@/services/candidate";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { FAB } from "react-native-elements";
const { width } = Dimensions.get("window");
function Home({ navigation }: ApplicationScreenProps<"Homepage">) {
  const { user } = useAuth();
  const { data, isPending, refetch } = useQuery({
    queryKey: ["candidates"],
    queryFn: getCandidates,
  });

  const handleCardPress = (id: number) => {
    navigation.navigate("Detail", { id });
  };
  return (
    <>
      <FlatList
        ListHeaderComponent={
          <Text style={styles.title}>Daftar Kandidat OSIS</Text>
        }
        data={data}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data Available</Text>
          </View>
        )}
        renderItem={(e) => (
          <TouchableOpacity
            style={[styles.item]}
            key={e.item.id}
            onPress={() => handleCardPress(e.item.id)}
          >
            <Image
              style={styles.image}
              source={{
                uri: e.item.user.photo
                  ? e.item.user.photo
                  : "https://static.vecteezy.com/system/resources/previews/004/991/321/original/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
              }} // Replace with your card image URL
            />
            <Text style={styles.title}>
              {e.index + 1}. {e.item.user.name}
            </Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={refetch} />
        }
      />

      <FAB
        color="#0D860Dff"
        title={<MaterialIcons name="add" size={15} color="white" />}
        visible={user?.role === "ADMIN"}
        placement="right"
        onPress={() => {
          navigation.navigate("AddCandidate");
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  row: {
    justifyContent: "space-around",
  },
  item: {
    marginVertical: 10,
    width: width / 2 - 20, // Dynamic width based on screen size
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    borderWidth: 2, // Add borderWidth to show selected state
    borderColor: "transparent", // Default border color
  },

  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  title: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
});

export default Home;
