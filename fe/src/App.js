
import './App.css';
// import { Button } from "@chakra-ui/react"
import {Route, Routes} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" Component={HomePage} exact/>
      <Route path="/chat" Component={ChatPage}/>
      </Routes>
    </div>
  );
}

export default App;
