import React,{Fragment, useEffect, useRef} from "react";
import ReactDOM from "react-dom/client";
const Card= ({card,deleteCard,setDrag,moveCard,openCardWindow})=>{

    const onDragStart=(e)=>{
        // e.persist();
        e.dataTransfer.effectAllowed = "copyMove";
        const CardImg=()=>{
         return(  
            <div className="card" style={{opacity:"1"}}>
                <p className="card-title">{card.title}
                    {/* <a><i className="fa-solid fa-spinner"></i></a> */}
                    </p>
                    <p className="card-content">{card.content}</p>
                    {(card.status!==null)&&<a className="card-footer"><i className={card.status}></i></a>}
            </div>
        )}
        
        let div=document.createElement("div");
        div.id="ghost";
        div.style.position = "absolute";
        div.style.top = "-1000px";
        const rect = e.target.getBoundingClientRect();
        const centerX = e.clientX-rect.left;
        const centerY = e.clientY-rect.top;
        div.style.width="220px";
        const ghost = ReactDOM.createRoot(
            div
        );
        // ReactDOM.render(<CardImg/>,div);
        ghost.render(<CardImg/>);
        document.body.appendChild(div);
        e.dataTransfer.setDragImage(div,centerX,centerY);
        setDrag(card);
    }
    const onDragOver=(e)=>{
        e.preventDefault();
        const rect=e.currentTarget.getBoundingClientRect();
        // Threshold for move action
        if(e.clientY+5<rect.bottom&&e.clientY-5>rect.top)
            moveCard(card);
        return;
       
    }
    const openWindow=(e)=>{
        if(e.target.id==="del"||e.target.className==="fa-solid fa-trash")
            return;
        openCardWindow(card);
    }
    const onDragEnd=()=>{
        const element=document.getElementById("ghost");
        if(element!==null)
        element.remove();
    }
    const cardDel=()=>{
        deleteCard(card.id);
    }
    return (
        // <Fragment>
        
            <div 
                id={"id"+card.id}
                className="card"
                onDragStart={onDragStart}
                onDragEnter={onDragOver}
                onClick={openWindow}
                onDragEnd={onDragEnd}
                draggable="true"
                style={{opacity:card.visibility}}
            >
                    <div className="card-title">
                    <p>{card.title}</p>
                    <button id="del" onClick={cardDel}><i className="fa-solid fa-trash"></i></button>
                    {/* <i className="fa-solid fa-spinner"></i> */}
                    </div>
                    <p className="card-content">{card.content}</p>
                    <a className="card-footer"><i className={card.status}></i></a>
            </div>
            
        // </Fragment>
    );
};

export default Card;