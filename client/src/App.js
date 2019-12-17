import React from 'react';

import {BrowserRouter as Router , Route} from 'react-router-dom'; 
import {Provider} from 'react-redux'
import jwt_decode from 'jwt-decode'
import {setCurrentUser, logoutUser} from './actions/authActions'
import setAuthToken from './utils/setAuthToken' 

import './App.css';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

import store from './store'

if(localStorage.jwtToken){
  setAuthToken(localStorage.jwtToken)
  const decoded=jwt_decode(localStorage.jwtToken)
  store.dispatch(setCurrentUser(decoded))

  const currentTime=Date.now()/1000
  if(decoded.exp<currentTime){
    store.dispatch(logoutUser())
    window.location.href='/login'
  }
}
function App() {
  return (
    <Provider store={store}>
      <Router>
          <div className="App">
            <Navbar/>
            <Route exact path="/" component ={Landing}/>
            <div className='container'>
            <Route exact path="/login" component ={Login}/>
            <Route exact path="/register" component ={Register}/>
            </div>
          
            
            <Footer />
        </div>
      </Router>
    </Provider>
   
  );
}

export default App;
