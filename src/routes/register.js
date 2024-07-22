import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: #ffffff;
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

const MainContent = styled.main`
  padding: 20px;
  margin-top: 60px; // ヘッダーの高さに応じて調整
  border-radius: 20px;
`;

const SectionHeader = styled.h3`
  text-align: left;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Logo = styled.img`
  height: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 20px;
  margin-bottom: 20px;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  background-color: #032952;
  color: white;
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  height: 30px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
  height: 50px;
  vertical-align: middle;
`;

const CheckboxCell = styled(TableCell)`
  text-align: center;  // チェックボックスセルは中央揃えのまま
`;

const LargeCheckbox = styled.input.attrs({ type: 'checkbox'})`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #032952;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #031299;
  }
`;

const AccordionButton = styled.button`
  background-color: #F0F9FD;
  color: #0000000;
  font-size: 18px;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  transition: 1s;
  
  &:hover {
    background-color: #96E5E9;
  }
  
  &:after {
    content: '\\002B';
    color: #777;
    font-weight: bold;
    font-size: 22px;
    float: right;
    margin-left: 5px;
  }
  
  &.active:after {
    content: "\\2212";
  }
`;

const AccordionPanel = styled.div`
  padding: 10px 0;
  background-color: white;
  max-height: ${props => props.isExpanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.2s ease-out;
`;

const AccordionTableHeader = styled(TableHeader)`
  background-color: #F0F9FD; // 新しい色を指定
  color: #000000;
  height: 30px;
  padding: 0 12px;
  line-height: 30px;
`;

const AccordionTable = ({ data, includeCheckbox, onCheckboxChange }) => (
  <Table style={{ height: '300px', overflowY: 'auto' }}>
    <colgroup>
      <col style={{ width: '25%' }} />
      <col style={{ width: '15%' }} />
      <col style={{ width: '45%' }} />
      <col style={{ width: '15%' }} />
      {includeCheckbox && <col style={{ width: '10%' }} />}
    </colgroup>
    <thead>
      <TableRow>
        <AccordionTableHeader>氏名</AccordionTableHeader>
        <AccordionTableHeader>年齢</AccordionTableHeader>
        <AccordionTableHeader>住所</AccordionTableHeader>
        <AccordionTableHeader>性別</AccordionTableHeader>
        <AccordionTableHeader>続柄</AccordionTableHeader>
        {includeCheckbox && <AccordionTableHeader>選択</AccordionTableHeader>}
      </TableRow>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.age}</TableCell>
          <TableCell>{item.address}</TableCell>
          <TableCell>{item.sex}</TableCell>
          <TableCell>{item.relation}</TableCell>
          {includeCheckbox && (
            <CheckboxCell>
              <input 
                type="checkbox" 
                onChange={(e) => onCheckboxChange(e, item)}
              />
            </CheckboxCell>
          )}
        </TableRow>
      ))}
    </tbody>
  </Table>
);

export default function Register() {
    const location = useLocation();
    const navigate = useNavigate();
    const [policyNum, setPolicyNum] = useState("");
    const [loginId, setLoginID] = useState("");
    const [isOriginTableExpanded, setIsOriginTableExpanded] = useState(false);
    const [originData, setOriginData] = useState([]);
    const [childrenData, setChildrenData] = useState([]);
    const [parentsData, setParentsData] = useState([]);
    const [spouseData, setSpouseData] = useState([]);
    const [siblingsData, setSiblingsData] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedSpouse, setSelectedSpouse] = useState(null);

    const handleMessage = useCallback((event) => {
        if (event.data.type === 'setOriginTableExpanded') {
            setIsOriginTableExpanded(event.data.expanded);
        }
    }, []);

    useEffect(() => {
        const receivedPolicyNum = location.state?.policyNum;
        console.log('Policy number received in Register:', receivedPolicyNum);
        if (receivedPolicyNum) {
            setPolicyNum(receivedPolicyNum);
        }

        // ダミーデータの設定。適宜書き換え
        setOriginData([
            { name: '田中太郎', age: 50, relation: '父', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '大学生です', sex: '男', description:'20歳男性', contract: 0},
            { name: '田中次郎', age: 20, relation: '次男', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '就職活動中です',sex: '男', description:'20歳男性', contract: 0},
            { name: '田中桃子', age: 18, relation: '長女', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '大学受験を控えています',sex: '女', description:'21歳女性', contract: 0},
        ]);

        setChildrenData([
          { name: '田中四郎', age: 24, relation: '長男', postcode: '231-0023', address:'神奈川県 横浜市中区 山下町 2-7-1', note: '大学生です', sex: '男', description:'20歳男性', contract: 0},
          { name: '田中さくら', age: 21, relation: '長女', postcode: '330-0061', address:'埼玉県 さいたま市浦和区 常盤 5-2-9', note: '就職活動中です',sex: '女', description:'21歳女性', contract: 0},
          { name: '田中竜馬', age: 15, relation: '次男', postcode: '260-0013', address:'千葉県 千葉市中央区 中央 3-10-8', note: '高校受験を控えています',sex: '男', description:'20歳男性', contract: 0},
        ]);

        setParentsData([
            { name: '田中美咲', age: 77, relation: '祖母', postcode: '350-0043', address:'埼玉県 川越市 新富町 1-22', note: '世間話が長いです',sex: '女', description:'77歳女性', contract: 0},
            { name: '田中昭', age: 77, relation: '祖父', postcode: '350-0043', address:'埼玉県 川越市 新富町 1-22', note: 'タバコが好きです',sex: '男', description:'77歳男性', contract: 0},
            { name: '田中ちよ', age: 81, relation: '祖母', postcode: '273-0005', address:'千葉県 船橋市 本町 2-1-1', note: '世間話が長いです',sex: '女', description:'81歳女性', contract: 0},
        ]);

        setSpouseData([
            { name: '田中涼子', age: 48, relation: '母', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '女', description:'48歳女性', contract: 0 },
            { name: '田中恵', age: 32, relation: '母', postcode: '150-0002', address:'東京都 渋谷区 渋谷 2-21-1', note: '倹約家です',sex: '女', description:'32歳女性', contract: 0 },
            { name: '田中里美', age: 44, relation: '母', postcode: '359-1123', address:'埼玉県 所沢市 日吉町 11-5', note: '倹約家です',sex: '女', description:'56歳女性', contract: 0 },
        ]);

        setSiblingsData([
            { name: '田中真美', age: 46, relation: '妹', postcode: '271-0092', address:'千葉県 松戸市 松戸 1307-1', note: '倹約家です',sex: '女', description:'46歳女性', contract: 0 },
            { name: '田中新次郎', age: 52, relation: '兄', postcode: '238-0004', address:'神奈川県 横須賀市 小川町 11', note: '倹約家です',sex: '男', description:'52歳女性', contract: 0 },
            { name: '田中加奈子', age: 54, relation: '姉', postcode: '135-0061', address:'東京都 江東区 豊洲 2-2-1', note: '倹約家です',sex: '女', description:'54歳女性', contract: 0 },
        ]);

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [location.state, handleMessage]);

    const handleToggleOriginTable = () => {
        setIsOriginTableExpanded(!isOriginTableExpanded);
    };

    const handleCheckboxChange = (event, member) => {
        if (event.target.checked) {
            setSelectedMembers([...selectedMembers, member]);
        } else {
            setSelectedMembers(selectedMembers.filter(m => m.name !== member.name));
        }
    };

    const handleSpouseCheckboxChange = (event, spouse) => {
        if (event.target.checked) {
            setSelectedSpouse(spouse);
            setSelectedMembers(prevMembers => {
                // 以前の配偶者を削除し、新しい配偶者を追加
                const withoutPreviousSpouse = prevMembers.filter(m => m.relation !== '母');
                return [...withoutPreviousSpouse, spouse];
            });
        } else {
            setSelectedSpouse(null);
            setSelectedMembers(prevMembers => prevMembers.filter(m => m.name !== spouse.name));
        }
    };

    const handleCommit = () => {
        console.log('Commit button clicked');
        navigate('/new_family', { state: { selectedMembers } });
    };

    const handleClose = () => {
        console.log('Close button clicked');
        navigate('/family_tree');
    };

    const StandardTable = ({ data, includeCheckbox, onCheckboxChange, isSpouseTable }) => (
        <Table>
            <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '45%' }} />
                <col style={{ width: '15%' }} />
                {includeCheckbox && <col style={{ width: '10%' }} />}
            </colgroup>
            <thead>
                <TableRow>
                    <TableHeader>氏名</TableHeader>
                    <TableHeader>年齢</TableHeader>
                    <TableHeader>住所</TableHeader>
                    <TableHeader>性別</TableHeader>
                    {includeCheckbox && <TableHeader>選択</TableHeader>}
                </TableRow>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.age}</TableCell>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>{item.sex}</TableCell>
                        {includeCheckbox && (
                            <CheckboxCell>
                              <LargeCheckbox 
                                onChange={(e) => isSpouseTable ? handleSpouseCheckboxChange(e, item) : onCheckboxChange(e, item)}
                                checked={isSpouseTable ? selectedSpouse?.name === item.name : selectedMembers.some(m => m.name === item.name)}
                            />
                            </CheckboxCell>
                        )}
                    </TableRow>
                ))}
            </tbody>
        </Table>
    );


    return (
        <Container>
            <Header>
                <Logo src="/logo.png" alt="かんぽ生命" />
                <div>KMP_01:山田太郎</div>
            </Header>
            <MainContent>
                    <AccordionButton
                        onClick={handleToggleOriginTable}
                        className= {isOriginTableExpanded ? 'active' : ''}>
                        ■ 追加先の世帯情報
                    </AccordionButton>
                    <AccordionPanel isExpanded={isOriginTableExpanded}>
                        <AccordionTable data={originData} includeCheckbox={false} />
                    </AccordionPanel>
                    <SectionHeader>親と子供、配偶者を選択して下さい</SectionHeader>

                    <SectionHeader>■ 子供を選択して下さい</SectionHeader>
                    <StandardTable data={childrenData} includeCheckbox={true} onCheckboxChange={handleCheckboxChange} />

                    <SectionHeader>■ 親を選択して下さい</SectionHeader>
                    <StandardTable data={parentsData} includeCheckbox={true} onCheckboxChange={handleCheckboxChange} />

                    <SectionHeader>■ 配偶者を選択して下さい</SectionHeader>
                    <StandardTable
                        data={spouseData}
                        includeCheckbox={true}
                        onCheckboxChange={handleSpouseCheckboxChange}
                        isSpouseTable={true}
                    />
                    <SectionHeader>■ 兄弟姉妹を選択して下さい</SectionHeader>
                    <StandardTable data={siblingsData} includeCheckbox={true} onCheckboxChange={handleCheckboxChange} />

                    <Button onClick={handleCommit}>確定</Button>
                    <Button onClick={handleClose}>閉じる</Button>

            </MainContent>
        </Container>
    );
}