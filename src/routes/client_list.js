import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';

//ここから下は体裁部分
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans JP', sans-serif;
  background-color: #f0f2f5;
  color: #333;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
`;

const Logo = styled.img`
  height: 40px;
`;

const ConsultantName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  font-family: 'Noto Sans JP', sans-serif;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  margin-top: 60px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  font-family: 'Noto Sans JP', sans-serif;

`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DateLabel = styled.span`
  margin-right: 1rem;
  color: #555;
  font-weight: 500;
  font-size: 20px;
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  font-family: 'Noto Sans JP', sans-serif;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #032952;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    background-color: #1557b0;
  }
`;

const IframeContainer = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
`;

const LogoutButton = styled(Button)`
  background-color: #032952;
  color: #ffffff;
  
  &:hover {
    background-color: #e8eaed;
  }
`;

export default function ClientList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [consultantId, setConsultantId] = useState("");
    const [clients,setClients] = useState("");
    const [visitDate, setVisitDate] = useState("");

    useEffect(() => {
        const handleMessage = (event) => {
            console.log('Received message in ClientList:', event.data);
            if (event.data.type === 'setVisitDate'){
              setVisitDate(event.data.date);
            } else if (event.data.type === 'navigateToContract') {
                navigate('/contract', { state: { clientId: event.data.clientId } });
            } else if (event.data.type === 'navigateToRelativeList') {
                navigate('/family_tree', { state: { clientName: event.data.clientName } });
            } else if (event.data.type === 'navigateToRegister') {
                navigate('/register', { state: { policyNum: event.data.policyNum } });
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    useEffect(() => {
        const receivedConsultantId = location.state?.loginId;
        console.log('Consultant ID received in ClientList:', receivedConsultantId);
        if (receivedConsultantId) {
            setConsultantId(receivedConsultantId);
            fetchClients(receivedConsultantId);
        }
    }, [location.state]);

    //ここは実際のAPIコールに書き換え
    const fetchClients = (id) => {
      const dummyClients = [
        { id: 1, name: "顧客A", policy: "P001" },
        { id: 2, name: "顧客B", policy: "P002" },
    ];
    setClients(dummyClients);
    };

    const handleRouteDisplay = () => {
        navigate('/route_guide');
    };

    //ログアウト処理
    const handleLogout = () => {
      console.log('loggin out');
      navigate('/consultant')
    }
    
    return (
        <Container>
            <Header>
                <Logo src="/logo.png" alt="ロゴ" />
                <ConsultantName>KMP_01:山田太郎</ConsultantName>
            </Header>
            <Main>
                <ControlsContainer>
                    <Title>訪問リスト</Title>
                    <DateContainer>
                        <DateLabel>訪問日</DateLabel>
                        <DateInput 
                          type="date" 
                          id="visitDate"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                        />
                        <Button onClick={handleRouteDisplay}>ルート表示</Button>
                    </DateContainer>
                </ControlsContainer>
                <IframeContainer>
                    <iframe
                        title="client_list"
                        src={`/02_client_list/index.html?consultantId=${consultantId}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none"
                        }}
                    ></iframe>
                </IframeContainer>
            </Main>
            <Footer>
                  <LogoutButton id="logoutButton" onClick={handleLogout}>ログアウト</LogoutButton>
            </Footer>
        </Container>
    );
}