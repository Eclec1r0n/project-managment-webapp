import React from "react";

const Form=({addCard,card,isClose,display,status})=>{
    const [formContent,setformContent]=React.useState(card);

    const handleChange=(event)=>{
        const name=event.target.name;
        const val=event.target.value;
        setformContent(prev=>{
            return{
                ...prev,
                [name]:val,
                columnKey:status
            }
        });
    }

    const addItem=(event)=>{
        event.preventDefault();
        addCard(formContent);
        isClose();
        setformContent({
            title:"",
            content:"",
            visibility:1,
            id:-1
        });
    }

    const closeWindow=()=>{
        setformContent({
            title:"",
            content:"",
            visibility:1,
            id:-1
        });
        isClose();
    }

    return(
        <div className="window" style={display}>
        
            <div className="form-card">
                <div className="form-header">
                    <button onClick={closeWindow}><i className="fa-solid fa-xmark fa-xl"></i></button>
                </div>
                    <form>
                        <div className="form-1">
                            <h3>Title</h3>
                            <input maxLength="22" placeholder="Title" name="title" onChange={handleChange} value={formContent.title}></input>
                            <h3>Description</h3>
                            <textarea maxLength="100" name="content" placeholder="Short Description" onChange={handleChange} value={formContent.content}></textarea>
                            {/// Working on this feature
                                /* <h3>Uploads</h3>
                            <div className="uploads">
                                <p>No Uploads</p>
                            </div>
                            <input id="file" type="file" accept="image/*,.pdf" multiple></input> */}
                        </div>
                        {/* <div className="form2">
                            <div className="list1">
                                <h3>Add-Ons</h3>
                                <p>Chat Box<input id="chatbox" name="chatbox" type="checkbox" onChange={handleChange} value={formContent.title}></input></p>
                                <p>Component List<input id="chatbox" name="chatbox" type="checkbox" onChange={handleChange} value={formContent.title}></input></p>
                                <p>DeadLine<input id="chatbox" name="chatbox" type="date" onChange={handleChange}></input></p>
                                <p>Board<input id="chatbox" name="chatbox" type="checkbox" onChange={handleChange}></input><a><i class="fa-solid fa-plus"></i></a></p>
                            </div>
                            <div className="list2">
                                <h3>Members</h3>
                                <p><a><i>Icon </i></a>Chetas</p>
                                <input placeholder="Search..." onChange={handleChange}></input>
                                <a><i class="fa-solid fa-plus"></i></a>
                            </div>
                        </div> */}
                        
                        
                    </form>
                    <footer><button className="submit-button"  onClick={addItem} value="submit">Submit</button></footer>
            </div>

        </div>
    )
}

export default Form;