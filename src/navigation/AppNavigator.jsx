import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import InputForm from '../screens/InputForm';
import Loading from '../screens/Loading';
import Results from '../screens/Results';
import RoomScan from '../screens/RoomScan';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976D2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="InputForm" 
          component={InputForm}
          options={{ title: 'Input Form' }}
        />
        <Stack.Screen 
          name="Loading" 
          component={Loading}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Results" 
          component={Results}
          options={{ title: 'Your Results' }}
        />
        <Stack.Screen 
          name="RoomScan" 
          component={RoomScan}
          options={{ title: 'Scan Room' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

