import React,{useRef} from "react";


const DropArea=({children,onDrop,columnKey,onDragEnter})=>{

    const cInit=useRef(null)
    const flag=useRef(false)
    const dropHandle=()=>{
        flag.current=false;
        cInit.current=null;
        onDrop();
    }
    const onDragOver=(e)=>{
        
        onDragEnter(columnKey);
        e.preventDefault();
        if(cInit.current===null)
            cInit.current=e.clientY;
        flag.current=flag.current||((Math.abs(e.clientY-cInit.current)>3));
        if(flag.current){    
            const element=document.getElementsByClassName("container")[0];
            const rect=element.getBoundingClientRect();
            const column=e.currentTarget.querySelector(".column-area");
            if(e.clientY>=rect.bottom-60){
            column.scrollTop+=2;
            }
            if(e.clientY<=245)
            column.scrollTop-=2;
        }
        
    }

    return (
        <div className="container-wrapper" onDragOver={onDragOver}  onDrop={dropHandle}>
            {children}
        </div>
    );
}

export default DropArea;