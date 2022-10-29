import React, {useState,useRef,useEffect} from "react";
import Column from "./Column.jsx";
import Form from "./Form.jsx";
import axios from "axios";
import ColumnForm from "./ColumnForm";
import { useNavigate, useParams } from 'react-router-dom'; 
import uuid from "react-uuid";

const Board=()=> {
  const navigateTo=useNavigate();
  const {actId}=useParams();
  const [message,setMessage]=useState("")
  const [cardList,setCard]= useState([]);
  const [actBoard,setTitle] = useState("")
  const [draggedElement,setDraggedElement]=useState(null);
  const [display,setDisplay]= useState({display:"none"});
  const [status,setStatus]= useState(null);
  const [formFlag,setformFlag]= useState(false);
  const [formCard,setformCard]= useState({
    title:"",
    content:"",
    visibility:1,
    id:-1
  });
    
  const openWindow=(id,card)=>{
      setformFlag(true);
      setStatus(id);
      if(!(card===null))
      setformCard(card);
      else
      setformCard({
        title:"",
        content:"",
        visibility:1,
        id:-1
      })
      setDisplay({display:"flex"});
  }
  const isClose=()=>{
      setformFlag(false);
      setDisplay({display:"none"});
  }
  
  const onDrop=()=>{
      setCard(prev=>{
        const arr=[...prev];
        const ind=arr.findIndex(p=>p.visibility===0.2);
        if(ind<0)
        return [...arr];
        arr[ind].visibility=1;
        return [...arr];
      });
  }
  const onDragEnter=(columnKey)=>{
    if(draggedElement.columnKey===columnKey)
      return;
    setStatus(columnKey);
    draggedElement.columnKey=columnKey;
    moveCard(null);
  }
  const moveCard=(element)=>{

    setCard(prev=>{
      draggedElement.visibility=0.2;
      setDraggedElement(draggedElement);
      if(element===null)
      return [...prev.filter(p=>p.id!==draggedElement.id),{...draggedElement}]; 
      const cardIndex=prev.findIndex(c=>c.id===draggedElement.id);
      const oncardIndex=prev.findIndex(c=>c.id===element.id);
      const arr=[...prev];
      arr.splice(cardIndex,1);
      arr.splice(oncardIndex,0,draggedElement);
      return [...arr];
    })
  }
  const addCard=(card)=>{
      if(card!==null&&card.id===-1){
        setCard(prev=>{
          // const max=prev.length;
          return [...prev,{...card,id:uuid()}];
        });
      }
      else{
        setCard(prev=>{
          const arr=prev;
          const ind=arr.findIndex(p=>p.id===card.id);
          arr[ind]=card;
          return [...arr];
        });
      }
  }
  const onDropOutside=(e)=>{
      onDrop();
  }
  const setDragElement=(element)=> {
    setDraggedElement(element);
  }
  const cXInit=useRef(null);
  const onMouseMove=(e)=>{
    if(cXInit.current===null)
      cXInit.current=e.clientX;
    if((Math.abs(e.clientX-cXInit.current)>5)){    

      const element=document.getElementsByClassName("main")[0];
      const rect=element.getBoundingClientRect();
      if(e.clientX>=rect.right-150){
        element.scrollLeft+=1;
      }
      if(e.clientX<=rect.left+150){
        element.scrollLeft-=1;
      }
    }

  } 
  const setEventListeners=()=>{
    if(draggedElement===null){
      
      return;
    }
    
    const card=document.getElementById("id"+draggedElement.id);
    // cards.forEach(c=>c.addEventListener("drag",(onMouseMove)));
    card.addEventListener("dragend",(e)=>{
      cXInit.current=null;
      e.preventDefault();
      const element=document.getElementById("ghost");
      if(element!==null)
        element.remove();
      getPositions(e);
    });
  }
    

  const getData=async ()=>{
    const id=actId;
    axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL+"/get/"+id,
    })
    .then(res=>{
      if(res.data==="N"){
        navigateTo("/");
        return;
      }
      setTitle(res.data.title)
      setCard(res.data.cardList);
    })
    .catch(err=>{
      const data=JSON.parse(window.localStorage.getItem(actId+"_cache"));
      if(data!==null){
        setCard(data);
      }
    })
  }
  const setData=()=>{
    const id=actId;
    axios({
      method: "POST",
      data: cardList,
      withCredentials: true,
      url: process.env.REACT_APP_API_URL+"/post/"+id,
  })
    .then(res=>{
      setMessage("Saved");
      setTimeout(()=>{
        setMessage("");
      },3000)
    })
    .catch(err=>{
      setMessage("Server Error");
      setTimeout(()=>{
        setMessage("");
      },3000)
      console.log(err);
    })
  }

  useEffect(() => {
    window.localStorage.setItem(actId+"_cache", JSON.stringify(cardList));
  }, [cardList]);
  useEffect(() => {
   setEventListeners();
    
  }, [status]);  
    
    useEffect(()=>{
      // if(onload.current){
        setEventListeners();
        getData();
      //   onload.current=false;
      // }
    },[])

    const getPositions=(e)=>{

        const container=document.getElementsByClassName("main");
        const rect=container[0].getBoundingClientRect();
        if(e.clientX<=rect.left||e.clientX>=rect.right||e.clientY<=rect.top||e.clientY>=rect.bottom){
          onDrop();
        }
        
    }
    const deleteCard=(id)=>{
      setCard(prev=>{
        return([...prev.filter(c=>c.id!==id)])
      })
    }
    const logOut=()=>{
      window.open(process.env.REACT_APP_API_URL+"/logout", "_self");
    }
    const messageStyle={zIndex:"5",padding:"2px",borderRadius:"5px",position:"absolute",top:"70px",left:"8px",backgroundColor:"white",color:"black",fontSize:"1.25em"}
  return(
    <div onDragOver={(e)=>{e.preventDefault();onMouseMove(e)}} 
    onDrop={onDropOutside} 
    onDragEnd={onDrop}
    // onDragEnd={setEventListeners}
     >
      
      {formFlag&&<Form card={formCard} addCard={addCard} display={display} isClose={isClose} status={status}/>}
        <div className="navbar">
        <p style={{color:"white",fontSize:"1.5em",fontStyle:"italic",margin:"0 30px"}}>{actBoard}</p>
        <ul onDragStart={(e)=>e.preventDefault()}>
          <li onClick={()=>navigateTo("/")}>Home</li>
          <li onClick={()=>alert("Working on this feature")}>Account</li>
          <li onClick={logOut}>Logout</li>
        </ul>
        </div>
        <div className="toolbar">
        <div>
          <button onClick={setData}><i className="fa-solid fa-floppy-disk fa-xl"></i>
          {message!==""&&<p style={messageStyle}>{message}</p>}
          </button>
          {/* <button  className="save-button" onMouseEnter={userList} style={{backgroundColor:"grey"}}>{}<Users/></button> */}
          <button onClick={(e)=>{e.preventDefault();alert("Currently working on it")}}><i className="fa-solid fa-plus fa-xl"></i></button>
          <button onClick={(e)=>{e.preventDefault();alert("Currently working on it")}}><i className="fa-solid fa-gear fa-xl"></i></button>
          </div>
        </div>
        <div className="main">
          <div className="container">
            <Column key="A" id="A" title="Open"        deleteCard={deleteCard} openWindow={openWindow} onDragEnter={onDragEnter} onDrop={onDrop} moveCard={moveCard} setDragElement={setDragElement} cardList={cardList}/>
            <Column key="B" id="B" title="In Progress" deleteCard={deleteCard} openWindow={openWindow} onDragEnter={onDragEnter} onDrop={onDrop} moveCard={moveCard} setDragElement={setDragElement} cardList={cardList}/>
            <Column key="C" id="C" title="Review"      deleteCard={deleteCard} openWindow={openWindow} onDragEnter={onDragEnter} onDrop={onDrop} moveCard={moveCard} setDragElement={setDragElement} cardList={cardList}/>
            <Column key="D" id="D" title="Completed"   deleteCard={deleteCard} openWindow={openWindow} onDragEnter={onDragEnter} onDrop={onDrop} moveCard={moveCard} setDragElement={setDragElement} cardList={cardList}/>
            <ColumnForm/>
          </div>
        </div>
    </div>
  );
}

export default Board;