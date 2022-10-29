import axios from "axios";
import React,{useState } from "react";
import { useNavigate } from "react-router-dom";
const Login=()=>{
    const navigateTo=useNavigate();
    const [message,setMessage]=useState("Y")
    const [formContent,setFormContent]=useState({
        email:"",
        password:""
    });
    const onLogin=async (e)=>{
        e.preventDefault();
        if(formContent.email===""||formContent.password===""){
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
            url: process.env.REACT_APP_API_URL+"/login",
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
    const loginWithGoogle=()=>{
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
        <div style={{height:"fit-content"}}>
            <div className="local">
                <div className="external">
                    <button onClick={loginWithGoogle}><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>Login with Google</button>
                </div>
                <form onSubmit={onLogin}>
                    <input placeholder="Email" name="email" type="email" onChange={handleChange} value={formContent.email}></input>
                    <input placeholder="Password" name="password" type="password" autoComplete="on" onChange={handleChange} value={formContent.password}></input>
                    <button type="submit">Login</button>
                </form>
                <button onClick={()=>navigateTo("/register")}>Register</button>
            </div>
        </div>
        </div>
    )
}

export default Login;