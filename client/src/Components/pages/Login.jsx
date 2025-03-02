import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const API = "https://j2xgxqqbaa3vluvbzasmwdpokq0oplew.lambda-url.ap-south-1.on.aws"

    const handleSubmit = (e) => {
        e.preventDefault();
        const body = {
            username: username,
            password: password
        }
        try {
            axios.post(API+"/login", body).then(
                (response) => {
                    localStorage.setItem("jwt_token" , response.data.token)
                    console.log("/login response: ", response);

                    const token = localStorage.getItem("jwt_token")

                    if(response.status == 200) {
                        axios.get(API+"/welcome",{headers: {
                            "Authorization" : `Bearer ${token}`
                        }, 
                        withCredentials : true}).then((response) => {
                            if(response.status == 200) {
                                localStorage.setItem("username", response.data.user.name);
                                navigate("/welcome");
                            }
                            
                        })
                        
                    }
                    
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
