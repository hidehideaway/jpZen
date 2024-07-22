import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';

const API_BASE_URL = 'http://localhost:8040';

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

const Main = styled.main`
  flex: 1;
  padding: 20px;
`;

const FamilyTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 40px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #001096;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
`;

const IframeContainer = styled.iframe`
  width: 100%;
  height: calc(100vh - 70px);
  border: none;
`;

const Description = styled.pre`
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 40px;
  text-align: justify;
  color: #333;
  white-space: pre-line;
  word-wrap: break-word;
`;

export default function NewFamily() {
    const location = useLocation();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const treeContainerRef = useRef(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        const receivedMembers = location.state?.selectedMembers;
        if (receivedMembers) {
            const formattedMembers = receivedMembers.map(member => ({
                name: member.name,
                age: parseInt(member.age) || 0,
                relation: member.relation || "不明",
                note: member.note || "不明",
                description: member.description || "不明",
                contract: parseInt(member.contract) || 0
            }));
            setSelectedMembers(formattedMembers);
        }
    }, [location.state]);
    
    useEffect(() => {
        const iframe = iframeRef.current;
        
        const handleIframeLoad = () => {
            if (iframe.contentWindow && iframe.contentWindow.initFamilyTree) {
                console.log('initFamilyTree function found, calling with:', selectedMembers);
                iframe.contentWindow.initFamilyTree(selectedMembers);
            } else {
                console.error('initFamilyTree function not found in iframe');
            }
        };
    
        if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
        }
    
        return () => {
            if (iframe) {
                iframe.removeEventListener('load', handleIframeLoad);
            }
        };
    }, [selectedMembers]);

    return (
        <Container>
            <Header>
                <Logo src="/logo.png" alt="かんぽ生命" />
                <div>Consultant_01</div>
            </Header>
            <Main>
                <IframeContainer
                    ref={iframeRef}
                    title="new_family"
                    src="/08_new_family/index.html"
                />
                <Title>更新後の家族構成 - 田中次郎様</Title>
                <FamilyTreeContainer ref={treeContainerRef}>
                </FamilyTreeContainer>
            </Main>
        </Container>
    );
}