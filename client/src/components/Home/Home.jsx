import React from "react";
import BoardSection from "./BoardSection";

const Home = ()=>{

    const logOut=()=>{
        window.open(process.env.REACT_APP_API_URL+"/logout", "_self");
    }
    return(
        <div>
            <div className="navbar">
                <ul onDragStart={(e)=>e.preventDefault()}>
                    <li onClick={()=>alert("Working on this feature")}>Account</li>
                    <li onClick={logOut}>Logout</li>
                </ul>
            </div>
            <div className="feature-title">
                <h1>Boards</h1>
                <BoardSection/>
                <h1>Other Features (Upcoming)</h1>
            </div>
            <div>

            </div>
        </div>
    );
}

export default Home;