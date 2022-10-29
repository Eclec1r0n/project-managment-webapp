import React,{useState,useRef, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import uuid from "react-uuid";
const BoardSection = ()=>{
    const topId=useRef(0);
    const [changedId,setId]=useState(null);
    const [deleteFlag,setDeleteFlag]=useState(false);
    const [editFlag,setEditFlag]=useState(true);
    const navigateTo=useNavigate();
    const [form,setForm]=useState({
        id:0,
        title:"",
        content:"",
        deadline:"",
        priority:"Low",
        flag:false
    });
    const [formEdit,updateForm]=useState({
        id:-1,
        title:"",
        content:"",
        deadline:"",
        priority:"Low",
        flag:false
    });
    const [boardList,addBoard]=useState([]);
    // const valueToColorMapping={
    //     VeryHigh:"red",
    //     High:"orange",
    //     Medium:"yellow",
    //     Low:"green"
    // }
    const submitBoard=(e)=>{
    
        e.preventDefault();
        const tempForm =(formEdit.id===-1)?form:formEdit;
        if(tempForm.title===""||tempForm.content==="")
            return;
        setEditFlag(true);
        addBoard(prev=>{
            const arr=prev;
            form.id=uuid();
            const tempForm =(formEdit.id===-1)?form:formEdit;
            arr.forEach(a=>a.flag=true);
            const ind=arr.findIndex(c=>(c.id===tempForm.id));
            setId(tempForm.id);
            if(ind===-1){
                return [...prev,{...tempForm,flag:true}];
            }
            setId(tempForm.id);
            arr[ind]={...tempForm,flag:true};
            return [...arr];
        });
        setForm({
            id:topId.current,
            title:"",
            content:"",
            deadline:"",
            priority:"Low",
            flag:false
        });
        updateForm(prev=>{
            return {...prev,id:-1};
        });
        topId.current=boardList.length;
        // setData();
    }

    
    const handleChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        let obj={
            [name]:value,
        }
        setForm(prev=>{
            return {...prev,...obj};
        });
    }

    const editChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        let obj={
            [name]:value
        }
        updateForm(prev=>{
            return {...prev,...obj};
        })
    }
    const enable=(id)=>{
        setEditFlag(false);
        setForm({
            id:topId.current,
            title:"",
            content:"",
            deadline:"",
            priority:"Low",
            flag:false
        });
        addBoard(prev=>{
            const arr=prev;
            arr.forEach(a=>a.flag=true);
            const ind=arr.findIndex(c=>c.id===id);
            arr[ind].flag=false;
            updateForm(arr[ind]);
            return [...arr]; 
        })  
    }
    const deleteBoard=(id)=>{
        const arr=boardList.filter(b=>b.id!==id)
        setId(id);
        addBoard(arr);
        setDeleteFlag(true);
        // axios({
        //     method: "DELETE",
        //     data: {
        //         board:arr,
        //         id:id
        //     },
        //     withCredentials: true,
        //     url: "http://localhost:8080/post",
        // })
        // .then((res) => {
        // })
    }
    async function getData(){
         axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:8080/get",
          })
          .then((res) => {
            addBoard(res.data);
        })
        .catch(err=>{
            addBoard([...JSON.parse(window.localStorage.getItem("home_cache"))]);
            console.log(err)
        })
    }
    async function setData(){
         axios({
            method: "POST",
            data: {
                board:boardList,
                id:changedId,
                deleteFlag:deleteFlag
            },
            withCredentials: true,
            url: "http://localhost:8080/post",
        })
        .then((res) => {
            setDeleteFlag(false);
        })
        .catch(err=>{
          if(boardList.length!==0)  
          window.localStorage.setItem("home_cache", JSON.stringify(boardList));
          console.log(err);
        })
    }
    useEffect(()=>{
        getData();
        
    },[]);
    useEffect(()=>{
        if(boardList.length!==0&&editFlag===true){
            setData();
        }
    },[boardList,changedId]);
    useEffect(()=>{
        if(deleteFlag){
            setData();
            setDeleteFlag(false);
        }
    },[deleteFlag,changedId]);

    return(
        <div style={{
            display:"flex",
            flexWrap:"wrap",
            gap:"5px"
        }}>
            {boardList.map((board,ind)=>
            <div className="board-card" key={ind}>
                {editFlag&&
                <div>
                <button className="edit-button" onClick={()=>enable(board.id)}><a><i className="fa-regular fa-pen-to-square"></i></a></button>
                <button className="delete-button" onClick={()=>deleteBoard(board.id)}><a><i className="fa-solid fa-trash"></i></a></button>
                </div>
                }
                <fieldset disabled={board.flag} onClick={()=>{
                (board.flag)&&navigateTo("/board/"+board.id);
                }}>
                    <form onSubmit={submitBoard}>
                    
                        <div className="board-card-title">
                            <h3><input maxLength="20" placeholder="Title" name="title" onChange={editChange} value={(board.flag)?board.title:formEdit.title}></input></h3>
                            <h3><textarea maxLength="100" placeholder="Summary" name="content" onChange={editChange} value={(board.flag)?board.content:formEdit.content}></textarea></h3>
                        </div>
                        <div>
                            <select name="priority" value={(board.flag)?board.priority:formEdit.priority} onChange={editChange}>
                                <option  value="VeryHigh">Very High</option>
                                <option  value="High">High</option>
                                <option  value="Medium">Medium</option>
                                <option  value="Low">Low</option>
                            </select>
                        </div>
                        {!board.flag&&<button type="submit"><i className="fa-solid fa-floppy-disk"></i></button>}
                        
                    </form>
                </fieldset>
            </div>
            )}
            <div className="board-card">
                <form onSubmit={submitBoard}>
                    <div className="board-card-title">
                        <h3><input maxLength="20" placeholder="Title" name="title" onChange={handleChange} value={form.title}></input></h3>
                        <h3><textarea maxLength="100" placeholder="Summary" name="content" onChange={handleChange} value={form.content}></textarea></h3>
                    </div>
                    <div>
                        <select name="priority" value={form.priority} onChange={handleChange}>
                            <option  value="VeryHigh">Very High</option>
                            <option  value="High">High</option>
                            <option  value="Medium">Medium</option>
                            <option  value="Low">Low</option>
                        </select>
                    </div>
                    <button type="submit"><i className="fa-solid fa-plus"></i></button>
                </form>
            </div>
        </div>
    )
}

export default BoardSection;