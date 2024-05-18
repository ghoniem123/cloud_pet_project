/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import axios from 'axios';
import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import InfoHover from '../components/infoHover';
import { UserContext } from '../App';


export default function ProfilePage() {
    const { user, setUser } = useContext(UserContext); 
    console.log("---------->",user);
    const username = user.data.username;
    const [isVisible, setVisible] = useState(false);
    const [name, setName] = useState(user.data.name);
    const [age, setAge] = useState(user.data.age);
    const [photoUrl, setPhotoUrl] = useState('');
    const [isNameReadoOnly, setIsNameReadOnly ] = useState(true);
    const [isAgeReadoOnly, setIsAgeReadOnly ] = useState(true);
    const [isNameUpdated, setIsNameUpdated] = useState(false);
    const [isAgeUpdated, setIsAgeUpdated] = useState(false);
    const[isDeleted, setIsDeleted] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);



    const navigate = useNavigate();

    async function deleteMe(){
        try{
            await axios.delete(`http://localhost:4000/${username}`);
            setIsDeleted(true);
            // sessionStorage.clear();
            setUser(null);
            navigate('/login');
        }catch(err){
            console.log(err);
        }
    }

    async function updateName(e){
        e.preventDefault();
        try{
            if(name === ''){
                setVisible(true);
                return;
            }
        const {data}= await axios.put('http://localhost:4000/user/name', {username, name});
        console.log(data)
        sessionStorage.clear();
        // sessionStorage.setItem('user',  );
        setUser(data)
        sessionStorage.setItem('user', JSON.stringify(data));

        setIsNameUpdated(true);
        setIsNameReadOnly(true);
            
        }catch(err){
            console.log(err);
        }
    }

    async function updateAge(e){
        e.preventDefault();
        try{
            if(age === 0){
                setVisible(true);
                return;
            }
        const {data} = await axios.put('http://localhost:4000/user/age', {username, age});
        sessionStorage.clear();
        // sessionStorage.setItem('user',  JSON.stringify(data));
        setUser(data)
        sessionStorage.setItem('user', JSON.stringify(data));

        setIsAgeUpdated(true);
        setIsAgeReadOnly(true);
            
        }catch(err){
            console.log(err);
        }
    }

    async function updatePhoto(photo){
        // e.preventDefault();
        try{
            if(photo === null ){
                setVisible(true);
                return;
            }

            if(photo === undefined)
                return;

        const formData = new FormData();
        formData.append('photo', photo);   
        formData.append('username', username) 

        console.log(photo===undefined)
        console.log("---------->",photo);
        
        await axios.put('http://localhost:4000/user/photo', formData,{
            headers: {
                'Content-Type': 'multipart/form-data', //to let the server know that the data is in form of file
              },
        });

        setIsUploaded(true);
            
        }catch(err){
            console.log(err);
        }
    
    }

    const handleImageInput = (e) =>{
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            updatePhoto(file);
            // setPhoto(file);
            // console.log("-----------------kkkkkkkkkkkkkkk-->",file);
        }
        updatePhoto();
    }

    async function getImage(){
        console.log("imageeeeeeeeeeeeeeeeeeeeeeeeeee")
        try{
            console.log(username);
          const { data } = await axios.post(`http://localhost:4000/user/image` ,  {imageKey:`${username}-photo` });
           console.log(data.url);
          setPhotoUrl(data.url);  

        }catch(err){

             console.log(err);
        }
        
   }

    useEffect(()=>{
        if(isUploaded){
            getImage();
            setIsUploaded(false);
        }
    },[isUploaded])


    useEffect( ()=>{
    getImage();
    })

    return (
        <>
        <InfoHover info={true} open={isNameUpdated} close={ ()=>setIsNameUpdated(false) }  title={"Updated successfuly!"} body={"The pet name updated successfully!!"} />

        <InfoHover info={true} open={isAgeUpdated} close={ ()=>setIsAgeUpdated(false) }  title={"Updated successfuly!"} body={"The pet age updated successfully!!"} />

        <InfoHover info={true} open={isDeleted} close={ ()=>setIsDeleted(false) }  title={"Deleted successfuly!"} body={"The pet record deleted successfully!!"} />

        <InfoHover error={true} open={isVisible} close={ ()=>setVisible(false) }  title={"Enter the new value"} body={"Please fill the info !!"} />
        <div className="info--div">
        <h1 className="info--title">Profile</h1>
        <div className="info--form">
            <p className="info--text"> pet user name</p>
            <h1 className="info--text" style={{color:'blue', fontSize:50}} >{username}</h1>

                        
            <p className="info--text"> pet photo</p>
            <img src={photoUrl} alt="pet" className="info--photo"/>
            <input type="file" accept="image/*" onChange={handleImageInput} />

      
            <p className="info--text"> pet name</p>
            <input className="info--input" type="text" placeholder="name" value={name} readOnly={isNameReadoOnly} onChange={(e)=> setName(e.target.value)}/>
            {!isNameReadoOnly?<button onClick={()=>{setIsNameReadOnly(true); setName(user.name)}}>Cancel</button>:<button onClick={ ()=> setIsNameReadOnly(false)}>Edit</button>}
            {!isNameReadoOnly&&<button onClick={updateName}>Save</button>}

            <p className="info--text"> pet age</p>
            <input className="info--input" type="number" placeholder="age" value={age} readOnly={isAgeReadoOnly} onChange={(e)=> setAge(Number(e.target.value))}/>
            {!isAgeReadoOnly?<button onClick={()=>{setIsAgeReadOnly(true); setAge(user.age)}}>Cancel</button>:<button onClick={ ()=> setIsAgeReadOnly(false)}>Edit</button>}
            {!isAgeReadoOnly&&<button onClick={updateAge}>Save</button>}

        </div>
        <br/>

        < button onClick={deleteMe} >Delete</button>
        <br/>
         <br/>
         
        <button onClick={ () => navigate('/login')}>Logout</button>
        </div>
        </>
    )

}
