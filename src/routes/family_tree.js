import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';

const API_BASE_URL = 'http://localhost:8080';

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
  font-family: 'Noto Sans JP', sans-serif;
  `;

const Logo = styled.img`
  height: 40px;
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

const MemberRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
`;

const FamilyTreeSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const FamilyLine = styled.line`
  stroke: #001096;
  stroke-width: 2;
`;

const Title = styled.h1`
  color: #001096;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
`;

const Description = styled.pre`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 40px;
  text-align: justify;
  color: #333;
  white-space: pre-line;
  word-wrap: break-word;
  padding: 20px;
  max-height: 200px;
  overflow-y:auto;
`;

const MemberCard = styled.div`
  position: relative;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 16, 150, 0.1);
  padding: 20px;
  margin: 0 15px;
  width: 220px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 16, 150, 0.2);
  }
`;

const MemberName = styled.h3`
  color: #001096;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const MemberInfo = styled.p`
  color: #333;
  font-size: 16px;
  margin: 8px 0;
`;

const Button = styled.button`
  background-color: #001096;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 40px;

  &:hover {
    background-color: #000d7a;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 16, 150, 0.3);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props => props.contract === 1 ? '#28a745' : '#dc3545'};
`;

const IframeContainer = styled.iframe`
  width: 100%;
  height: 0;
  border: none;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
`;

const FamilyMember = React.forwardRef(({ member, onMemberClick }, ref) => (
  <MemberCard onClick={() => onMemberClick(member.id)} ref={ref}>
    {member.contract !== 0 && (
      <Badge contract={member.contract}>
        {member.contract === 1 ? '契約者' : '被保険者'}
      </Badge>
    )}
    <MemberName>{member.name}</MemberName>
    <MemberInfo>年齢: {member.age}</MemberInfo>
    <MemberInfo>性別: {member.sex}</MemberInfo>
  </MemberCard>
));

const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

export default function FamilyTree() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientName, setClientName] = useState("");
  const [familyData, setFamilyData] = useState(null);
  const [description, setDescription] = useState("");
  const [windowWidth] = useWindowSize();
  const treeContainerRef = useRef(null);
  const memberRefs = useRef({});
  const iframeRef = useRef(null);

  useEffect(() => {
    const receivedClientName = location.state?.clientName;
    if (receivedClientName) {
      setClientName(receivedClientName);
    }
    fetchFamilyData();
  }, [location.state]);

  const fetchFamilyData = async () => {
    try {
      console.log('Fetching family data...');
      const response = await fetch(`${API_BASE_URL}/server/family-tree`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      if (data.family_tree) {
        console.log('Setting family data:', data.family_tree);
        // contract プロパティを各メンバーに追加
        const updatedFamilyTree = {
          ...data.family_tree,
          center: { ...data.family_tree.center, contract: data.family_tree.center.contract || 0 },
          parents: data.family_tree.parents.map(parent => ({ ...parent, contract: parent.contract || 0 })),
          children: data.family_tree.children.map(child => ({ ...child, contract: child.contract || 0 })),
        };
        setFamilyData(updatedFamilyTree);
        setDescription(data.description);
      } else {
        console.error('Family tree data not found in API response');
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
    }
  };    

  const handleMemberClick = (memberId) => {
    navigate('/register', { state: { policyNum: '0000000', memberId: memberId } });
  };

  const handleRegister = () => {
    navigate('/register', { state: { policyNum: '0000000' } });
  };

  const connectMembers = () => {
    if (!treeContainerRef.current) return [];
  
    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const lines = [];
  
    const center = memberRefs.current[familyData.center.id];
    if (center) {
      const centerRect = center.getBoundingClientRect();
      const centerX = centerRect.left + centerRect.width / 2 - containerRect.left;
      const centerY = centerRect.top - containerRect.top;
  
      // 中央の人物と親を接続
      if (familyData.parents.length > 0) {
        const parentRect = memberRefs.current[familyData.parents[0].id].getBoundingClientRect();
        const parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
        const parentY = parentRect.bottom - containerRect.top;
  
        lines.push(
          { x1: centerX, y1: centerY, x2: centerX, y2: (centerY + parentY) / 2 },
          { x1: centerX, y1: (centerY + parentY) / 2, x2: parentX, y2: (centerY + parentY) / 2 },
          { x1: parentX, y1: (centerY + parentY) / 2, x2: parentX, y2: parentY }
        );
      }
  
      // 中央の人物と子供を接続
      if (familyData.children.length > 0) {
        const childrenRects = familyData.children.map(child => memberRefs.current[child.id].getBoundingClientRect());
        const childrenTopY = childrenRects[0].top - containerRect.top;
        const centerBottomY = centerRect.bottom - containerRect.top;
  
        // 中央から下への縦線
        lines.push({
          x1: centerX,
          y1: centerBottomY,
          x2: centerX,
          y2: (childrenTopY + centerBottomY) / 2
        });
  
        // 子供たちへの横線
        familyData.children.forEach(child => {
          const childRect = memberRefs.current[child.id].getBoundingClientRect();
          const childX = childRect.left + childRect.width / 2 - containerRect.left;
  
          lines.push(
            { x1: centerX, y1: (childrenTopY + centerBottomY) / 2, x2: childX, y2: (childrenTopY + centerBottomY) / 2 },
            { x1: childX, y1: (childrenTopY + centerBottomY) / 2, x2: childX, y2: childrenTopY }
          );
        });
      }
    }
  
    return lines;
  };
    
  const renderFamilyMember = (member) => (
    <FamilyMember
      key={member.id}
      member={member}
      onMemberClick={handleMemberClick}
      ref={el => memberRefs.current[member.id] = el}
    />
  );

  if (!familyData) return <Container>読み込み中...エラーが発生した場合はページを更新してください。</Container>;

  const lines = connectMembers();

  return (
    <Container>
      <Header>
        <Logo src="/logo.png" alt="かんぽ生命" />
        <div>KMP_01:山田太郎</div>
      </Header>
      <Main>
        <IframeContainer
            ref={iframeRef}
            title="family_tree"
            src="/04_family_tree/index.html"
        />
      <Title>家族構成 - {clientName}様</Title>
      <Description>{description}</Description>
      <FamilyTreeContainer ref={treeContainerRef}>
        <MemberRow>
          {familyData.parents.map(renderFamilyMember)}
        </MemberRow>
        <MemberRow>
          {renderFamilyMember(familyData.center)}
        </MemberRow>
        <MemberRow>
          {familyData.children.map(renderFamilyMember)}
        </MemberRow>
        <FamilyTreeSVG>
          {lines.map((line, index) => (
            <FamilyLine key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          ))}
        </FamilyTreeSVG>
      </FamilyTreeContainer>
      <Button onClick={handleRegister}>登録へ進む</Button>
      </Main>
    </Container>
  );
}