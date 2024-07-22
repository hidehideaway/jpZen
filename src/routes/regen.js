import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const FamilyMember = ({ member, isCenter }) => (
    <div className={`card mb-3 family-member ${isCenter ? 'border-primary' : ''}`} style={{ width: '18rem' }}>
        <div className="card-body">
            <h5 className="card-title">{member.name}</h5>
            <p className="card-text">続柄: {member.relation}</p>
            <p className="card-text">年齢: {member.age}</p>
            <p className="card-text">注意事項: {member.notes}</p>
        </div>
    </div>
);

export default function Regen() {
    const location = useLocation();
    const [family, setFamily] = useState(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        const receivedFamily = location.state?.family;
        console.log('Family data received in Regen:', receivedFamily);
        if (receivedFamily) {
            setFamily(receivedFamily);
        }
    }, [location.state]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'familyData') {
                setFamily(event.data.family);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const renderFamilyTree = () => {
        if (!family) return null;

        const centerMember = {
            name: "田中太郎",
            relation: "父",
            age: 45,
            notes: "仕事の話は避けてください"
        };

        return (
            <div className="container">
                <h2 className="mb-4">家系図</h2>
                <div className="d-flex justify-content-center mb-3">
                    {family.parents.map((parent, index) => (
                        <FamilyMember key={index} member={parent} isCenter={false} />
                    ))}
                </div>
                <div className="d-flex justify-content-center mb-3">
                    <FamilyMember member={centerMember} isCenter={true} />
                </div>
                <div className="d-flex justify-content-center flex-wrap">
                    {family.children.map((child, index) => (
                        <FamilyMember key={index} member={child} isCenter={false} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <div>
                    <img src="/logo.png" alt="ロゴ" style={{ height: '40px' }} />
                </div>
                <div>Consultant_01</div>
            </header>
            <main style={{ flex: 1, padding: '20px' }}>
                {family ? renderFamilyTree() : <p>家族データを読み込んでいます...</p>}
            </main>
        </div>
    );
}