import React, {useState} from 'react';
import { Link , useHistory } from 'react-router-dom';
import axios from 'axios'
import {showErrMsg,showSuccessMsg} from '../../utils/notification/Notification'
import {dispatchLogin} from '../../../redux/actions/authAction'
import { useDispatch } from 'react-redux';


const initialState = {
    email: '',
    password : '',
    err : '',
    success : ''
}
function Login() {
  const [user,setUser] = useState(initialState)  
  
  const dispatch = useDispatch()
  
  const history = useHistory()
   
  const {email , password , err, success} = user
  
  
  const HandleChangeInput = e =>{
      const {name, value} = e.target
      setUser({...user,[name]:value,err:'', success:''})
  }

  const handleSubmit = async e =>{
      e.preventDefault()
      try{
          const res = await axios.post('/user/login', {email,password})
          setUser({...user, err: '', success: res.data.msg})

          localStorage.setItem('firstLogin',true)
          
          dispatch(dispatchLogin())
          history.push("/")
        }catch(err){
          err.response.data.msg && 
          setUser({...user, err: err.response.data.msg, success:''})
      }
  }
  return (
    <div className="login_page">
        <h2>login</h2>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email Address :</label>
                <input type="text" placeholder="Enter email address" id="email" value={email} name="email" onChange={HandleChangeInput}/>
            </div>

            <div>
                <label htmlFor="password">Password :</label>
                <input type="password" placeholder="Enter your secret password" id="password" value={password}  name="password" onChange={HandleChangeInput}/>
            </div>

            <div className="row">
                <button type="submit">login</button>
                <Link to="/forgot_password">Forgot your password ?</Link>
            </div>
        </form>
        <p>New Customers ? <Link to="/register">Register Now</Link></p>
        
    </div>
  );
}

export default Login;