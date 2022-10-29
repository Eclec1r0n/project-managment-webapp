import React,{useState,useEffect,useRef} from "react";
import Board from "./Board/Board";
import Home from "./Home/Home";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import { Route, Routes, Navigate } from 'react-router-dom';  
import axios from "axios";

const App = ()=>{

    const [user,setUser]=useState(undefined);
    const checkAuth=()=>{
        axios({
            method: "GET",
            withCredentials: true,
            url: process.env.REACT_APP_API_URL+"/local-auth",
          })
          .then((res) => {
            if(res.data==="Y")
                setUser(res)
            else
                setUser(null)
        });
        return;
    }
    
    
    useEffect(()=>{
        checkAuth();
     },[])

    return(
        <div>
        {user!==undefined&&
        <div>        
            <Routes>
                <Route exact path="/" element={(user===null)?<Navigate to="/login"/>:<Home/>}/>
                <Route exact path="/login" element={(user!==null)?<Navigate to="/register"/>:<Login/>}/>
                <Route exact path="/register" element={(user!==null)?<Navigate to="/"/>:<Register/>}/>
                <Route exact path="/board/:actId" element={(user===null)?<Navigate to="/"/>:<Board/>}/>
                <Route exact path="/*" element={<Navigate to="/"/>}/>
            </Routes>
        </div>
        }
        </div>
    ); 
}

export default App;