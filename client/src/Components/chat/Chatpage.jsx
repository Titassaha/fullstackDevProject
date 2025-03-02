import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';

const socket = io.connect("http://localhost:4000")

const Chatpage = () => {

    const [message, setMessage] = useState("");
    const [image, setImage] = useState();
    const [rxMessage, setRxMessage] = useState("");
    const [rxImage, setRxImage] = useState();

    useEffect(() => {
        socket.on("receivedMessage", (data) => {
            console.log(data.message);
            setRxMessage(data.message)
            setRxImage(URL.createObjectURL(new Blob([data.image])))
        })
    }, [socket])

    const sendMessage = (e) => {
        e.preventDefault();

        const file = image;


        if (file) {
            var blob = new Blob([file], { type: file.type });
            // socket.emit("image", {message : blob});

        }

        socket.emit("sendMessage", { message: message, image: blob })
        setImage()
        setMessage("")

    }



    return (
        <>
            <div className='flex justify-center m-5'>
                <input type='text' placeholder='type here...' onChange={(e) => { setMessage(e.target.value) }}></input>
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])}></input>
            </div>
            <div>
                <p className='flext justify-center text-lg'>Message : {rxMessage}</p>
            </div>
            <div className=' flex justify-center'>
                {rxImage && <img src={rxImage} alt="Received" className='size-1/3' />}
            </div>
        </>

    )
}

export default Chatpage
