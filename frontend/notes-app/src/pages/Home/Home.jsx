import React, { useState ,useEffect} from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { Link, useNavigate } from "react-router-dom";
import {MdAdd, MdOutlineAlarmAdd} from "react-icons/md"
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {

    const [openAddEditModal,setOpenAddEditModal]=useState(
        {
            isShown:false,
            type:"add",
            data:null,
        }
    );

    const [showToastMsg,setShowToastMsg]=useState({
        isShown:false,
        message:"",
        type:"add",
    });
    
    const [allNotes,setAllNotes]=useState([])
    const [userInfo,setUserInfo]=useState(null);

    const navigate=useNavigate();

    const handleEdit=(noteDetails)=>{
        setOpenAddEditModal({isShown:true,type:"edit",data:noteDetails})
    }

    const showToastMessage=(message,type)=>{
        setShowToastMsg({
            isShown:true,
            message,
            type,

        });
    }

    const handleCloseToast=()=>{
        setShowToastMsg({
            isShown:false,
            message:"",
        })
    }


    const deleteNote=async(data)=>{
        const noteId=data._id;
        try {
            const response = await axiosInstance.delete("/delete-note/"+noteId);
      
            if (response.data && !response.data.error) {
              showToastMessage("Note Deleted Successfully","delete")
              getAllNotes()
              
            }
          }
          catch (error) {
            if (
              error.response && error.response.data && error.response.data.message
            ) {
              console.log("An unexpected error occured.Please Try Again")
            }
      
          }
    };
    //Get User Info
    const getUserInfo=async()=>{
       try{
        const response=await axiosInstance.get("/getuser")
        if(response.data && response.data.user)
            {
                setUserInfo(response.data.user);
            }
       }
       catch(error){
        if(error.response.status===401)
            {
                localStorage.clear();
                navigate("/login");
            }
       }
    }

    //get all notes
    
    const getAllNotes=async()=>{
        try{
            const response=await axiosInstance.get("/get-all-notes")

            if(response.data && response.data.notes)
                {
                    setAllNotes(response.data.notes)
                }
        }
        catch(error)
        {
            console.log("An unexpected error occured.Please try again")
        }
    }   

    useEffect(()=>{
        getAllNotes();
        getUserInfo();
        
        
        return()=>{
        }
    },[])
    return (
        <>
            <Navbar userInfo={userInfo}/>
            <div className="container mx-auto">
              {allNotes.length>0 ?(<div className="grid grid-cols-3 gap-4 mt-8">
                    {allNotes.map((item,index)=>(
                         <NoteCard
                         key={item._id}
                         title={item.title}
                         date={moment(item.createdOn).format("Do MM YYYY")}
                         content={item.content}
                         tags={item.tags}
                         isPinned={item.isPinned}
                         onEdit={() => handleEdit(item)}
                         onDelete={() => deleteNote(item)}
                         onPinNote={() => { }}
                     />
                    ))}
                
                </div>):(
                <EmptyCard message={"Starting creating your first note by clicking on Add button"}/>)}
            </div>

            <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
            onClick={()=>{
                setOpenAddEditModal(
                    {isShown:true,type:"add",data:null}
                )

            }}
            >
                <MdAdd className="text-[30px] text-white"/>
            </button>

            <Modal
             isOpen={openAddEditModal.isShown}
             onRequestClose={()=>{}}
             style={{
                overlay:{
                 backgroundColor:"rgba(0,0,0,0.2)",
                },
             }}
             contentLabel=""
             className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow"
             >
          <AddEditNotes
          type={openAddEditModal.type}
          onClose={
            ()=>{
                setOpenAddEditModal({isShown:false,type:"add",data:null});
            }
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
          noteData={openAddEditModal.data}
          
          />
          
             </Modal>
             <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
             />
           
        </>
    )
}

export default Home;