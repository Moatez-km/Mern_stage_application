import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import{showErrMsg,showSuccessMsg} from '../../utils/notification/Notification'
import {isLength,isMatch } from '../../utils/validation/validation'
import {fetchAllUsers,dispatchGetAllUsers} from '../../../redux/actions/usersAction'
const initialState={
    name:'',
    password:'',
    cf_password:'',
    err:'',
    success:''
}

function Profile(){
    const auth=useSelector(state=>state.auth)
    const token=useSelector(state=>state.token)
    const users=useSelector(state=>state.users)


    const {user, isAdmin} =auth
    const [data,setData]= useState(initialState)
    const {name,password,cf_password,err,success}=data
    const[avatar,setAvatar]= useState(false)
    const[loading,setLoading]=useState(false)
    const[callback,setcallback]=useState(false)


    
    const dispatch = useDispatch()
    useEffect(()=>{
        if(isAdmin){
            
            return fetchAllUsers(token).then(res =>{
                dispatch(dispatchGetAllUsers(res))
            })
            
            }
        
    },[token,isAdmin,dispatch, callback])



    const handleChange = e=>{
        const{name,value}= e.target
        setData({...data,[name]:value,err:'',success:''})
    }
   const updateInfor=()=>{
       try{
            axios.patch('/user/update',{
                name:name? name:user.name,
                avatar:avatar ? avatar:user.avatar
            },{
                headers:{Authorization:token}
            })
            setData({...data,err:'',success:'Updated success !'})
       }catch(err){
        setData({...data,err:err.response.data.msg,success:''})
       }
   }
   const updatePassword=()=>{
    if(isLength(password))
        return setData({...data, err:"Password must be at least 6 characters", success:''})
    if(!isMatch(password,cf_password))
        return setData({...data, err:"Password did not match", success:''})
    try{
         axios.post('/user/reset',{password},{
             name:name? name:user.name,
             avatar:avatar ? avatar:user.avatar
         },{
             headers:{Authorization:token}
         })
         setData({...data,err:'',success:'Updated success !'})
    }catch(err){
     setData({...data,err:err.response.data.msg,success:''})
    }
}
const changeAvatar=async(e)=>{
    e.preventDefault()
    try{
        const file= e.target.files[0]
        if(!file) return setData({...data,err:"No file were uploaded",success:''})

        if(file.size > 1024*1024){
            return setData({...data,err:"size to large",success:''})
        }
        if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
            return setData({...data,err:"file format is incorrect",success:''})
        }

        let formData=new FormData()
        formData.append('file',file)

        setLoading(true)
        const res=await axios.post('/api/upload_avatar',formData,{
            headers:{'content-type':'multipart/form-data',Authorization:token}
        })

        setLoading(false)
        setAvatar(res.data.url)


    }catch(err){
        setData({...data,err:err.response.data.msg,success:''})
    }
}
const handleUpdate=()=>{
    if(name || avatar) updateInfor()
    if(password) updatePassword()
}
const handleDelete = async(id)=>{

    try {
        if(user._id !== id){
        if(window.confirm("Are you sure you want to delete this account?")){
            setLoading(true)
            await axios.delete(`/user/delete/${id}`,{
                headers:{Authorization:token}
            })
            setLoading(false)
            setcallback(!callback)

        }}
        
    } catch (err) {
        setData({...data,err:err.response.data.msg,success:''})
    }
}

    return (
        
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <h3>loading ...</h3>}

       
        <div className="profile_page">
            <div className="col-left">
                <h2>{isAdmin ? "Admin Profile":user.name}</h2>
                <div className="avatar">
                    <img src={avatar? avatar:user.avatar} alt=""/>
                    <span>
                    <i className="fas fa-camera"></i>
                    <p>Change</p>
                    <input type="file" name="file" id="file_up" onChange={changeAvatar}/>

                    </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name"></label>
                        <input type="text" name="name" id="name" placeholder="Your name" defaultValue={user.name}
                        onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"></label>
                        <input type="email" name="email" id="email" placeholder="Your email address" defaultValue={user.email}
                        disabled/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input type="password" name="password" id="password" placeholder="Your New password" value={password} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cf_password"></label>
                        <input type="password" name="cf_password" id="cf_password" placeholder="Confirm your password" value={cf_password} onChange={handleChange}/>
                    </div>
               <button disabled={loading} onClick={handleUpdate}>Update</button>
            </div>
            <div className="col-right">
                <h2>{isAdmin ? "Users":"My Orders"}</h2>
                <div style={{overflowX:"auto"}}>
                <table className="customers">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Action</th>
                            

                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(user =>(
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{
                                            user.role ===1
                                            ?<i className="fas fa-check" title="Admin"></i>
                                            :<i className="fas fa-times" title="user"></i>
                                            
                                                }</td>
                                        <td>
                                                <Link to={`/edit_user/${user._id}`}>
                                                <i className="fas fa-edit" title="edit"></i>
                                                </Link>
                                                <i className="fas fa-trash-alt" title="delete" onClick={()=> handleDelete(user._id)}></i>

                                        </td>

                                    </tr>
                                ))
                            }
                               
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    )
}
export default Profile