import './App.css';
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/authentication/login/login.js';
import HomePage from './components/home/home.js'
import SignupPage from './components/authentication/signup/signup.js';
import SearchPage from "./components/search/search.js";
import DetailsPage from "./components/details/details.js";
import authService from "./services/authService.js";
import Profile from "./components/profile/profile.js";
import ProfileEdit from "./components/profile/profileEdit.js";

function App() {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch the current user when the app loads
        const fetchCurrentUser = async () => {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        };

        fetchCurrentUser();
    }, []);



  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/details/:bookName" element={<DetailsPage />} />
          <Route path="/profile/:userId?" element={<Profile />} />
          <Route path="/profile/:userId?/edit" element={<ProfileEdit />} />
        </Routes>
      </Router>
  );
}

export default App;
