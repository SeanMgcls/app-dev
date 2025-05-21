import BtmNavbar from './components/BtmNavBar'

import { NavigationContainer, useNavigation } from '@react-navigation/native';

import './global.css';

export default function App() {
  return (
    <>
    <NavigationContainer>
      <BtmNavbar />
    </NavigationContainer>
    </>
  );
}
