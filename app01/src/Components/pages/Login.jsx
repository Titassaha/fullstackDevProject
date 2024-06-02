import axios from 'axios';
import React, { useState } from 'react'

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const RegAPI = "http://localhost:4000/login"

    const handleSubmit = () => {
        const body = {
            username: username,
            password: password
        }
        try {
            axios.post(RegAPI, body).then(
                (response) => {
                    console.log(response);
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

                <button>Login</button>
            </form>


        </div>
    )
}

export default Login
