import React from "react";
import Card from "./Card.jsx";
import DropArea from "./DropArea.jsx"

const Column=({deleteCard,openWindow,title,id,onDrop,onDragEnter,moveCard,setDragElement,cardList})=>{

    const openOldWindow=(card)=>{
        openWindow(id,card);
    }
    const openNewWindow=()=>{
        openWindow(id,null);
    }
    
    return(
 
        <DropArea columnKey={id} onDrop={onDrop} onDragEnter={onDragEnter}>
            <div className="column">
                    <div draggable="false" onDragStart={(event)=>event.preventDefault()}>
                        <h3 className="boardTitle" >{title}</h3>
                    </div>
                    <div className="column-area">
                        {cardList.map((c,ind)=>(
                            (id===c.columnKey)&&<Card key={ind} deleteCard={deleteCard} openCardWindow={openOldWindow} card={c} moveCard={moveCard} setDrag={setDragElement}/>
                        ))}
                    </div>
                    <button onClick={openNewWindow} className="button">Add Task</button>
            </div>
        </DropArea>
    );
}
export default Column;