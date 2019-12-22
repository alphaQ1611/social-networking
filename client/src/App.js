import React from 'react';

import {BrowserRouter as Router , Route,Switch} from 'react-router-dom'; 
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
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoutes from './components/common/PrivateRoutes'
import CreateProfile from './components/create-profile/CreateProfile'
import EditProfile from './components/edit-profile/EditProfile'
import AddExperience from './components/add-credentials/AddExperience'

import store from './store'
import { clearCurrentProfile } from './actions/profileActions';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';

if(localStorage.jwtToken){
  setAuthToken(localStorage.jwtToken)
  const decoded=jwt_decode(localStorage.jwtToken)
  store.dispatch(setCurrentUser(decoded))

  const currentTime=Date.now()/1000
  if(decoded.exp<currentTime){
    store.dispatch(logoutUser())
    store.dispatch(clearCurrentProfile())
    window.location.href='/login'
  }
}
else{
  store.dispatch(clearCurrentProfile())
  
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
            <Route exact path ='/profiles' component={Profiles}/>
            <Switch>
            <PrivateRoutes exact path="/dashboard" component ={Dashboard}/>
            </Switch>
            <Switch>
            <PrivateRoutes exact path="/edit-profile" component ={EditProfile}/>
            </Switch>
            <Switch>
            <PrivateRoutes exact path='/create-profile' component={CreateProfile}/>
            </Switch>
            <Switch>
            <PrivateRoutes exact path='/add-experience' component={AddExperience}/>
            </Switch>
            <Switch>
            <PrivateRoutes exact path='/add-education' component={AddEducation}/>
            </Switch>
            </div>
          
            
            <Footer />
        </div>
      </Router>
    </Provider>
   
  );
}

export default App;
