import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { chatHub } from '../services/ChatService';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    // Initialize SignalR connection
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(chatHub)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, []);

    // Start connection and set up listeners
    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR hub');
                    toast.success('Connected to chat server!');

                    connection.on('ReceiveMessage', (user, message) => {
                        setMessages(prevMessages => [...prevMessages, { user, message }]);
                    });
                })
                .catch(err => {
                    console.error('Connection failed:', err);
                    toast.error('Failed to connect to chat server.');
                });
        }
    }, [connection]);

    // Send message to hub
    const sendMessage = async () => {
        if (connection && message && user) {
            try {
                await connection.invoke('SendMessage', user, message);
                setMessage('');
            } catch (err) {
                console.error('Send failed:', err);
                toast.error('Failed to send message.');
            }
        } else {
            toast.warn('Enter both user and message.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>SignalR Chat</h2>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage} style={{ marginLeft: '10px' }}>Send</button>
            </div>

            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h4>Messages:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {messages.map((msg, index) => (
                        <li key={index}><strong>{msg.user}</strong>: {msg.message}</li>
                    ))}
                </ul>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Chat;
