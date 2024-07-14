import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Login, Startup } from "@/screens";
import { useTheme } from "@/theme";
import type { ApplicationStackParamList } from "@/types/navigation";
import Home from "@/screens/Home/Home";
import { useAuth } from "@/hooks/useAuth/useAuth";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import Hasil from "@/screens/Hasil/Hasil";
import Students from "@/screens/Students/Students";
import Detail from "@/screens/Detail/Detail";
import Header from "@/components/molecules/Header/Header";
import AddStudents from "@/screens/AddStudents/AddStudents";
import AddCandidate from "@/screens/AddCandidate/AddCandidate";
import StudentDetail from "@/screens/StudentDetail/StudentDetail";
const Stack = createStackNavigator<ApplicationStackParamList>();
const Tab = createBottomTabNavigator<ApplicationStackParamList>();
function HomeTabs() {
  const { user } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Homepage"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome name={"home"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Result"
        component={Hasil}
        options={{
          tabBarLabel: "Hasil",
          tabBarIcon: ({ color, size, focused }) => (
            <Entypo name={"megaphone"} color={color} size={size} />
          ),
        }}
      />
      {user?.role === "ADMIN" && (
        <Tab.Screen
          name="Students"
          component={Students}
          options={{
            tabBarLabel: "Siswa",
            tabBarIcon: ({ color, size, focused }) => (
              <FontAwesome6 name={"clipboard-user"} color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}
function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        key={variant}
        screenOptions={{
          header: (props) => (isLoggedIn ? <Header /> : undefined),
        }}
      >
        <Stack.Screen name="Startup" component={Startup} />
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen name="Detail" component={Detail} />
            <Stack.Screen name="StudentDetail" component={StudentDetail} />
            <Stack.Screen name="AddStudents" component={AddStudents} />
            <Stack.Screen name="AddCandidate" component={AddCandidate} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
