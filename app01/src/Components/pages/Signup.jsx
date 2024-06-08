
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const RegAPI = "http://localhost:4000/signup"

    const handleSubmit = () => {
        const body = {
            username: username,
            password: password
        }
        try {
            axios.post(RegAPI, body).then(
                (response) => {
                    console.log(response.data);
                }
            )
        }
        catch(error) {
            console.log(error);
        }

    }
    return (
        <div>
            <form onSubmit={handleSubmit}>

                <input type='text' id="username" placeholder='Enter username' onChange={(e) => setUsername(e.target.value)} />
                <input type='text' id="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />

                <button>SignUp</button>
            </form>

            <div className='flex justify-center'>
            <button onClick={() => {navigate('/login')}}>Login</button>
            </div>


        </div>
    )
}

export default Signup
