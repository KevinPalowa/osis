import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ApplicationScreenProps } from "@/types/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudents } from "@/services/student";
import { FAB, SearchBar } from "react-native-elements";
import _ from "lodash";

function Students({ navigation }: ApplicationScreenProps<"Students">) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["students", currentPage, searchQuery],
    queryFn: () => getStudents({ page: currentPage, limit, name: searchQuery }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    _.debounce(() => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300)();
  }, []);

  const handleNextPage = () => {
    if (data?.data.length === limit) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      {/* {isLoading && <Text>Loading...</Text>} */}
      {isError && <Text>Error loading data</Text>}

      <SearchBar
        placeholder="Search Students..."
        onChangeText={handleSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />

      <FlatList
        data={data?.data}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
            <Button
              title={"Tambah Siswa"}
              color="#0D860Dff"
              onPress={() => {
                navigation.navigate("AddStudents");
              }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            key={item.id}
            onPress={() => {
              navigation.navigate("StudentDetail", { id: item.id });
            }}
          >
            <Image
              style={styles.cardImage}
              source={{
                uri: item.photo
                  ? item.photo
                  : "https://static.vecteezy.com/system/resources/previews/004/991/321/original/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
              }} // Replace with your card image URL
            />
            <Text style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListFooterComponent={() => (
          <View style={styles.paginationContainer}>
            <Button
              title="Previous"
              onPress={handlePreviousPage}
              disabled={currentPage === 1}
            />
            <Text style={styles.pageNumber}>
              Page {currentPage} of {data?.meta?.totalPages ?? 0}
            </Text>
            <Button
              title="Next"
              onPress={handleNextPage}
              disabled={data && data?.meta.totalPages <= currentPage}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Data Available</Text>
          </View>
        )}
      />

      {/* <FAB
        title={<MaterialIcons name="add" size={15} color="white" />}
        placement="right"
        color="#0D860Dff"
        onPress={() => {
          navigation.navigate("AddStudents");
        }}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  searchContainer: {
    backgroundColor: "white",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchInput: {
    backgroundColor: "#EDEDED",
  },
  row: {
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: "40%",
    alignItems: "center",
    borderWidth: 2, // Add borderWidth to show selected state
    borderColor: "transparent", // Default border color
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  pageNumber: {
    fontSize: 16,
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

export default Students;
