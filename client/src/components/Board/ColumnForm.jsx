import React, {useState} from "react";


const ColumnForm = ()=>{
    const [columnName,setColumnName]=useState("Add Column");

    const changeName=(e)=>{
        setColumnName(e.targetvalue)
    }
    return (
        <div>
            <form onSubmit={(e)=>{e.preventDefault();alert("Currently working on it")}}>
                <div className="add-column">
                <input onChange={changeName} value={columnName}></input>
                <div><button type="submit"><i className="fa-solid fa-plus"></i></button></div>
                </div>
          </form>    
        </div>
    );
}

export default ColumnForm;