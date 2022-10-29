import axios from "axios";
import React,{useState} from "react";
import { useNavigate} from "react-router-dom";
const Register=()=>{
    const navigateTo=useNavigate();
    const [message,setMessage]=useState("Y")
    const [formContent,setFormContent]=useState({
        name:"",
        email:"",
        password:""
    });
    const onRegister=async (e)=>{
        e.preventDefault();
        if(formContent.email===""||formContent.password===""||formContent.name===""){
            setMessage("Missing field details!");
            setTimeout(()=>{
                setMessage("Y")
            },3000);
            return;
        }
        axios({
            method: "POST",
            data: formContent,
            withCredentials: true,
            url: process.env.REACT_APP_API_URL+"/register",
          })
          .then((res) => {
            if(res.data==="Y"){
                window.location.reload();
                return;
            }
            setMessage(res.data);
        });
        setTimeout(()=>{
            setMessage("Y")
        },3000);
    }
    const registerWithGoogle=()=>{
        window.open(process.env.REACT_APP_API_URL+"/google", "_self");
    }
    const handleChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setFormContent(prev=>{
            return {...prev,[name]:value}
        })
    }
    return(
        <div className="login-register">
        {message!=="Y"&&<p style={{position:"absolute",top:"-30px",color:"red",fontSize:"small"}}>{message}</p>}
            <div className="local">
                <div className="external">
                    <button onClick={registerWithGoogle}><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>Register with Google</button>
                </div>
                <form onSubmit={onRegister}>
                    <input placeholder="Name"     onChange={handleChange} name="name" type="text" value={formContent.first}></input>
                    <input placeholder="Email"    onChange={handleChange} name="email" type="email" value={formContent.email}></input>
                    <input placeholder="Password" onChange={handleChange} autoComplete="on" name="password" type="password" value={formContent.password}></input>
                    {/* <input placeholder="Confirm Password" type="password" value={formContent.password}></input> */}
                    <button type="submit">Register</button>
                </form>
                <button onClick={()=>navigateTo("/login")}>Login</button>
            </div>
        </div>
    )
}

export default Register;