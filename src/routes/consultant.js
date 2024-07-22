import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultant() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMessage = (event) => {
            console.log('Received message in Consultant:', event.data);
            if (event.data.type === 'navigateToClientList') {
                console.log('Navigating to client list with login ID:', event.data.loginId);
                navigate('/clientlist', { state: { loginId: event.data.loginId } });
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    return (
        <iframe
            title="consultant"
            src="/01_consultant/index.html"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none"
            }}
        ></iframe>
    );
}