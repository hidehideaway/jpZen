import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  background-color: #f7f7f7;
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
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  width: 98%;
  margin-top: 60px;
`;

const ContractInfo = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;


const ContractTitle = styled.h2`
  color: #1A1A2E;
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  font-weight: 700;
  font-family: 'Noto Sans JP', sans-serif;
`;

const TableContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  width: 85%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background-color: #032952;
  padding: 1rem;
  text-align: left;
  border: 1px solid #e0e0e0;
  border-radius: 4px 4px 0 0;
  font-weight: bold;
  color: #ffffff;
`;

const Td = styled.td`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  color: #032952;

  &:first-child {
    width: 33.33%; // 1/3 of the width for the item column
    text-align: center;
  }

  &:last-child {
    width: 66.67%; // 2/3 of the width for the value column
    text-align: left;
    padding: calc(1rem + 1ch);
  }
`;

const Button = styled.button`
  margin: 1rem 0.5rem 1rem 0;
  padding: 0.75rem 1.5rem;
  background-color: #032952;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 18px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
  background-color: #ffffff;
  color: #1A1A2E;
  font-size: 0.9rem;
`;

export default function Contract() {
    const navigate = useNavigate();
    const location = useLocation();
    const [clientId, setClientId] = useState("");
    const [contracts, setContracts] = useState("");
    const [currentContractIndex, setCurrentContractIndex] = useState(0);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'navigateToTop') {
                navigate('/');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    useEffect(() => {
        const receivedClientId = location.state?.clientId;
        console.log('Client ID received in Contract:', receivedClientId);
        if (receivedClientId) {
            setClientId(receivedClientId);
            fetchContracts(receivedClientId);
        }
    }, [location.state]);

    const fetchContracts = (clientId) =>{
        const contractData = {
            '12-34-5678901': [
                {
                    policyNumber: '12-34-5678901',
                    agentName: '山田太郎',
                    contractorNameKana: 'タナカタロウ',
                    contractorNameKanji: '田中太郎',
                    contractorBirthDate: '1980/01/01',
                    contractorPhone: '090-1234-5678',
                    insuredNameKana: 'タナカハナコ',
                    insuredNameKanji: '田中花子',
                    insuredBirthDate: '1985/02/02',
                    insuredPhone: '090-8765-4321',
                    contractType: '養老保険',
                    basicPremium: '10,000',
                    specialContractType: '入院一時金',
                    specialContractAmount: '500,000'
                },
            ], 
            '12-34-5678902': [
                {
                    policyNumber: '12-34-5678901',
                    agentName: '山田太郎',
                    contractorNameKana: 'サトウイチロウ',
                    contractorNameKanji: '佐藤一郎',
                    contractorBirthDate: '1980/01/01',
                    contractorPhone: '090-1234-5678',
                    insuredNameKana: 'サトウハナコ',
                    insuredNameKanji: '佐藤花子',
                    insuredBirthDate: '1985/02/02',
                    insuredPhone: '090-8765-4321',
                    contractType: '養老保険',
                    basicPremium: '10,000',
                    specialContractType: '入院一時金',
                    specialContractAmount: '500,000'
                },
            ],
        };
        setContracts(contractData[clientId] || []);
    };

    const nextContract = () => {
        setCurrentContractIndex((prevIndex)=>(prevIndex + 1) % contracts.length);
    };

    const closeContract = () => {
        navigate('/client_list');
    };
    
    const currentContract = contracts[currentContractIndex];

    return (
        <Container>
            <Header>
                <Logo src="/logo.png" alt="ロゴ" />
                <ConsultantName>担当者: 山田太郎</ConsultantName>
            </Header>
            <Main>
                <ControlsContainer>
                    <ContractTitle>契約情報 - 保険証券記号番号:{clientId}</ContractTitle>
                </ControlsContainer>
                {contracts.length > 0 ? (
                    <ContractInfo>
                        <TableWrapper>
                            <Table>
                                <tbody>
                                    <tr>
                                        <Th colSpan="2">基本情報</Th>
                                    </tr>
                                    <tr>
                                        <Td>保険証券記号番号</Td>
                                        <Td>{currentContract.policyNumber}</Td>
                                    </tr>
                                    <tr>
                                        <Td>受理者氏名</Td>
                                        <Td>{currentContract.agentName}</Td>
                                    </tr>
                                    <tr>
                                        <Th colSpan="2">契約者情報</Th>
                                    </tr>
                                    <tr>
                                        <Td>契約者氏名[カナ]</Td>
                                        <Td>{currentContract.contractorNameKana}</Td>
                                    </tr>
                                    <tr>
                                        <Td>契約者氏名[漢字]</Td>
                                        <Td>{currentContract.contractorNameKanji}</Td>
                                    </tr>
                                    <tr>
                                        <Td>生年月日</Td>
                                        <Td>{currentContract.contractorBirthDate}</Td>
                                    </tr>
                                    <tr>
                                        <Td>電話番号</Td>
                                        <Td>{currentContract.contractorPhone}</Td>
                                    </tr>
                                    <tr>
                                        <Th colSpan="2">被保険者情報</Th>
                                    </tr>
                                    <tr>
                                        <Td>被保険者氏名[カナ]</Td>
                                        <Td>{currentContract.insuredNameKana}</Td>
                                    </tr>
                                    <tr>
                                        <Td>被保険者氏名[漢字]</Td>
                                        <Td>{currentContract.insuredNameKanji}</Td>
                                    </tr>
                                    <tr>
                                        <Td>生年月日</Td>
                                        <Td>{currentContract.insuredBirthDate}</Td>
                                    </tr>
                                    <tr>
                                        <Td>電話番号</Td>
                                        <Td>{currentContract.insuredPhone}</Td>
                                    </tr>
                                    <tr>
                                        <Th colSpan="2">基本契約</Th>
                                    </tr>
                                    <tr>
                                        <Td>契約種類</Td>
                                        <Td>{currentContract.contractType}</Td>
                                    </tr>
                                    <tr>
                                        <Td>基本保険料額</Td>
                                        <Td>{currentContract.basicPremium}円</Td>
                                    </tr>
                                    <tr>
                                        <Td>特約種類</Td>
                                        <Td>{currentContract.specialContractType}</Td>
                                    </tr>
                                    <tr>
                                        <Td>特約保険金額</Td>
                                        <Td>{currentContract.specialContractAmount}円</Td>
                                    </tr>
                                </tbody>
                            </Table>
                        </TableWrapper>
                        <Button onClick={nextContract}>次の契約へ</Button>
                        <Button onClick={closeContract}>訪問リスト一覧へ戻る</Button>
                    </ContractInfo>
                ) : (
                    <p>該当する契約が見つかりません。</p>
                )}
            </Main>
            <Footer>
            </Footer>
        </Container>
    );
}