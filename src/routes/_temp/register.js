import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  font-family: 'Noto Sans JP', sans-serif;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: #f5f7fa;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  height: 40px;
`;

export default function Register() {
    const location = useLocation();
    const navigate = useNavigate();
    const [policyNum, setPolicyNum] = useState("");
    const [isOriginTableExpanded, setIsOriginTableExpanded] = useState(false);

    const handleMessage = useCallback((event) => {
        if (event.data.type === 'commitAndNavigate') {
            console.log('Received commitAndNavigate message:', event.data);
            const formattedMembers = event.data.members.map(member => ({
                name: member.name,
                age: parseInt(member.age) || 0,
                relation: member.relation || "ほげ",
                note: member.note || "不明",
                description: member.description || "不明",
                contract: parseInt(member.contract) || 0
            }));
            navigate('/new_family', { state: { selectedMembers: formattedMembers } });
        }
    }, [navigate]);

    useEffect(() => {
        const receivedPolicyNum = location.state?.policyNum;
        console.log('Policy number received in Register:', receivedPolicyNum);
        if (receivedPolicyNum) {
            setPolicyNum(receivedPolicyNum);
        }

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);

            const iframe = document.querySelector('iframe');
            if (iframe) {
                iframe.onload = () => {
                    iframe.contentWindow.postMessage({ type: 'setOriginTableExpanded', expanded: isOriginTableExpanded}, '*');
                };
            }
        };

    }, [location.state, handleMessage, isOriginTableExpanded]);

    const handleToggleOriginTable = () => {
        setIsOriginTableExpanded(!isOriginTableExpanded);
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.contentWindow.postMessage({ type: 'setOriginTableExpanded', expanded: !isOriginTableExpanded }, '*');
        }
    };

    return (
        <Container>
            <Header>
            <Logo src="/logo.png" alt="かんぽ生命" />
            <div>Consultant_01</div>
            </Header>
                <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <main style={{ flex: 1, padding: '20px' }}>
                        <iframe
                            title="register"
                            src={`/06_register/index.html?policyNum=${policyNum}`}
                            style={{
                                width: "100%",
                                height: "calc(100vh - 70px)",
                                border: "none"
                            }}
                        ></iframe>
                    </main>
                </div>
       </Container>
    );
}