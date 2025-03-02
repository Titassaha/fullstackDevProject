import logo from './logo.svg';
import './App.css';
import Login from './Components/pages/Login';
import Signup from './Components/pages/Signup';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Welcome from './Components/pages/Welcome';
import Chatpage from './Components/chat/Chatpage';

function App() {
  return (
    <Router>
    <div className="App">
     <Routes>
      <Route path='/' Component={Signup}/>
      <Route path='/login' Component={Login}/>
      <Route path='/welcome/' Component={Welcome}/>
      <Route path='/chat' Component={Chatpage}/>

     </Routes>
     
    </div>
    </Router>
  );
}

export default App;
