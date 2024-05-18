/* eslint-disable no-unused-vars */
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React,{useContext} from 'react';
import InfoHover from '../components/infoHover';
import { UserContext } from '../App';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [photo, setPhoto] = useState(null);
    const [isVisible, setVisible] = useState(false);
    const [error, setError] = useState(false);
    const [preview, setPreview] = useState(null);
    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        try {
            
            if(username === '' || name === '' || age === 0 || photo === null){
                setVisible(true);
                return;
            }

            const formData = new FormData();
            formData.append('username', username);
            formData.append('name', name);
            formData.append('age', age);
            formData.append('photo', photo);

            const { data } = await axios.post('http://localhost:4000/',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', //to let the server know that the data is in form of file
                  },
            });
            setUser(data);
            sessionStorage.setItem('user', JSON.stringify(data));

            navigate('/profile');
        } catch (error) {
            setError(true);
        }
    }

    const handleImageInput = (e) =>{
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setPhoto(file);
            setPreview(reader.result);
        }
    }

    return (
        <>
       <InfoHover error={true} open={isVisible} close={ ()=>setVisible(false) }  title={"Fill all the Info"} body={"Please fill all the info fields !!"} />
       <InfoHover error={true} open={error} close={ ()=>setError(false) }  title={"username is taken"} body={"Please try another username !!"} />

       <div className="info--div">
            <h1 className="info--title">Register</h1>
            <form onSubmit={register} className="info--form">

                <p className="info--text"> pet photo</p>
                {preview && <img src={preview} alt="preview" />}
                <input type="file" accept="image/*"  onChange={handleImageInput} />

                <p className="info--text"> pet user name</p>
                <input className="info--input" type="text" placeholder="will be used to login later" value={username} onChange={(e) => setUsername(e.target.value)} />
                <p className="info--text">pet name</p>
                <input className="info--input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <p className="info--text">pet age</p>
                <input className="info--input" type="number" placeholder="Age" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                <br/>
                <br/>
                <button type="submit">Register</button>
            </form>

            <br/>

            <button onClick={ () => navigate('/login')}>Login</button>
        </div>
        </>
    )
}