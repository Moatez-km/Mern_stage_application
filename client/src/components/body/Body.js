import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './auth/Login';
import Register from './auth/Register';
import ActivationEmail from './auth/ActivationEmail'
import NotFound from '../utils/NotFound/NotFound'; 
import ForgotPassword from './auth/ForgotPassword';
import ResetPass from './auth/ResetPassword';
import Profile from '../body/profile/Profile';
import {useSelector} from 'react-redux'
function Body() {
  const auth = useSelector(state =>state.auth)
  const {isLogged} =auth
  return (
   <section>
     <Switch>
        <Route path="/login" component={isLogged ? NotFound : Login} exact/>
        <Route path="/register" component={isLogged ? NotFound : Register} exact/>

        <Route path="/forgot_password" component={isLogged ? NotFound : ForgotPassword} exact/>

        <Route path="/user/reset/:token" component={isLogged ? NotFound : ResetPass} exact/>

       
     
        <Route path="/user/activate/:activation_token" component={ActivationEmail} exact/>
        <Route path="/profile" component={isLogged ? Profile : NotFound} exact/>
     </Switch>
   </section>
  );
}

export default Body;