import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InfoHover from '../components/InfoHover';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [isVisible, setVisible] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
            
        try {
            
            if(username === '' ){
                setVisible(true);
                return;
            }

            const formData = new FormData();
            formData.append('username', username);


            const { data } = await axios.get(`http://localhost:4000/${username}`);

            sessionStorage.setItem('user', JSON.stringify(data));
            console.log(JSON.parse(sessionStorage.getItem('user')).data);
            navigate('/profile');
        } catch (error) {
            setError(true);
        }
    }

    return (
        <>
       <InfoHover error={true} open={isVisible} close={ ()=>setVisible(false) }  title={"Enter the pet username"} body={"Please fill all the info fields !!"} />
       <InfoHover error={true} open={error} close={ ()=>setError(false) }  title={"username doesnt exist"} body={"Please try !!"} />

       <div className="info--div">
            <h1 className="info--title">Login</h1>
            <form onSubmit={login} className="info--form">

                <p className="info--text"> pet user name</p>
                <input className="info--input" type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
       
                <button type="submit">Login</button>
            </form>
            <br/>
            <button onClick={ () => navigate('/')}>Register</button>
        </div>
        </>
    )
}