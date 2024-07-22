import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';

const API_BASE_URL = 'http://35.79.74.81:8040';

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
  overflow-y: auto;
  margin-top: 20px;
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

const FamilyMember = React.forwardRef(({ member }, ref) => (
  <MemberCard ref={ref}>
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

export default function NewFamily() {
    const location = useLocation();
    const [familyData, setFamilyData] = useState(null);
    const [insuranceProposal, setInsuranceProposal] = useState("");
    const treeContainerRef = useRef(null);
    const memberRefs = useRef({});

    useEffect(() => {
        const receivedMembers = location.state?.selectedMembers;
        if (receivedMembers) {
            generateFamilyTree(receivedMembers);
        }
    }, [location.state]);

    async function generateFamilyTree(members) {
        try {
            const response = await fetch(`${API_BASE_URL}/generate_family_tree`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(members),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setFamilyData({
                grandparents: data.family_members.filter(m => m.relation === '祖父' || m.relation === '祖母'),
                parents: data.family_members.filter(m => ['父', '母', '兄', '姉', '弟', '妹'].includes(m.relation)),
                children: data.family_members.filter(m => ['長男', '長女', '次男', '次女'].includes(m.relation))
            });
            setInsuranceProposal(data.insurance_proposal);
        } catch (error) {
            console.error('Error generating family tree:', error);
        }
    }

    const connectMembers = () => {
        if (!treeContainerRef.current || !familyData) return [];
      
        const containerRect = treeContainerRef.current.getBoundingClientRect();
        const lines = [];
      
        // 祖父母を繋ぐ線
        let grandparentsCenterX = 0;
        let grandparentsY = 0;
        if (familyData.grandparents.length >= 2) {
            const grandfather = familyData.grandparents.find(g => g.relation === '祖父');
            const grandmother = familyData.grandparents.find(g => g.relation === '祖母');
            if (grandfather && grandmother) {
                const grandfatherRect = memberRefs.current[grandfather.name].getBoundingClientRect();
                const grandmotherRect = memberRefs.current[grandmother.name].getBoundingClientRect();
                grandparentsCenterX = (grandfatherRect.left + grandfatherRect.width / 2 + grandmotherRect.left + grandmotherRect.width / 2) / 2 - containerRect.left;
                grandparentsY = grandfatherRect.top + grandfatherRect.height / 2 - containerRect.top;
                lines.push({
                    x1: grandmotherRect.right - containerRect.left,
                    y1: grandparentsY,
                    x2: grandfatherRect.left - containerRect.left,
                    y2: grandparentsY
                });
            }
        } else if (familyData.grandparents.length === 1) {
            const grandparentRect = memberRefs.current[familyData.grandparents[0].name].getBoundingClientRect();
            grandparentsCenterX = grandparentRect.left + grandparentRect.width / 2 - containerRect.left;
            grandparentsY = grandparentRect.top + grandparentRect.height / 2 - containerRect.top;
        }

        // 父母と兄弟姉妹を繋ぐ線
        if (familyData.parents.length >= 2) {
            const father = familyData.parents.find(p => p.relation === '父');
//            const fatherX = fatherRect.left + fatherRect.width / 2 - containerRect.left;
            const mother = familyData.parents.find(p => p.relation === '母');
            const siblings = familyData.parents.filter(p => ['兄', '姉', '弟', '妹'].includes(p.relation));

            if (father && mother) {
                const fatherRect = memberRefs.current[father.name].getBoundingClientRect();
                const motherRect = memberRefs.current[mother.name].getBoundingClientRect();
                const fatherTop = fatherRect.top - containerRect.top;
                const fatherX = fatherRect.left + fatherRect.width / 2 - containerRect.left;
                const parentsCenterX = (fatherRect.left + fatherRect.width / 2 + motherRect.left + motherRect.width / 2) / 2 - containerRect.left;
                const parentsY = fatherRect.top + fatherRect.height / 2 - containerRect.top;
                const middleY = (grandparentsY + parentsY) / 2;
                
                // 祖父母と親を繋ぐ線
                if (familyData.grandparents.length > 0) {
                    lines.push(
                        { x1: grandparentsCenterX, y1: grandparentsY, x2: grandparentsCenterX, y2: middleY },  //縦線
                        { x1: grandparentsCenterX, y1: middleY, x2: fatherX, y2: middleY },                    //横線
                        { x1: fatherX, y1: fatherTop, x2: fatherX, y2: middleY }                     //縦線
                    );
                }
                
                // 兄弟姉妹を祖父母と繋ぐ折れ線
                if (siblings.length > 0) {
                    const siblingRect = memberRefs.current[siblings[0].name].getBoundingClientRect();
                    const siblingsY = siblingRect.top + siblingRect.height / 2 - containerRect.top;
                    const middleY = (grandparentsY + siblingsY) / 2;
                    
                    siblings.forEach(sibling => {
                        const siblingRect = memberRefs.current[sibling.name].getBoundingClientRect();
                        const siblingX = siblingRect.left + siblingRect.width / 2 - containerRect.left;
                        
                        lines.push(
                            { x1: grandparentsCenterX, y1: grandparentsY, x2: grandparentsCenterX, y2: middleY },
                            { x1: grandparentsCenterX, y1: middleY, x2: siblingX, y2: middleY },
                            { x1: siblingX, y1: middleY, x2: siblingX, y2: fatherTop }
                        );
                    });
                }

                // 父母を繋ぐ横線
                lines.push({
                    x1: fatherRect.right - containerRect.left,
                    y1: parentsY,
                    x2: motherRect.left - containerRect.left,
                    y2: parentsY
                });

                // 親と子供を繋ぐ線
                if (familyData.children.length > 0) {
                    const childrenRects = familyData.children.map(child => memberRefs.current[child.name].getBoundingClientRect());
                    const childrenTopY = childrenRects[0].top - containerRect.top;
                    const parentsBottomY = Math.max(fatherRect.bottom, motherRect.bottom) - containerRect.top;
                    const parentsY = fatherRect.top + fatherRect.height / 2 - containerRect.top;

                    lines.push({
                        x1: parentsCenterX,
                        y1: parentsY,
                        x2: parentsCenterX,
                        y2: (childrenTopY + parentsBottomY) / 2
                    });

                    familyData.children.forEach(child => {
                        const childRect = memberRefs.current[child.name].getBoundingClientRect();
                        const childX = childRect.left + childRect.width / 2 - containerRect.left;
                        const childY = childRect.top - containerRect.top;

                        lines.push(
                            { x1: parentsCenterX, y1: (childrenTopY + parentsBottomY) / 2, x2: childX, y2: (childrenTopY + parentsBottomY) / 2 },
                            { x1: childX, y1: (childrenTopY + parentsBottomY) / 2, x2: childX, y2: childY }
                        );
                    });
                }
            }
        }
      
        return lines;
    };

    const renderFamilyMember = (member) => (
        <FamilyMember
          key={member.name}
          member={member}
          ref={el => memberRefs.current[member.name] = el}
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
                <Title>更新後の家族構成 - 田中次郎様</Title>
                <Description>{insuranceProposal}</Description>
                <FamilyTreeContainer ref={treeContainerRef}>
                    <MemberRow>
                        {familyData.grandparents.map(renderFamilyMember)}
                    </MemberRow>
                    <MemberRow>
                        {familyData.parents.map(renderFamilyMember)}
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
            </Main>
        </Container>
    );
}