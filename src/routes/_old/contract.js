import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultant() {
    const navigate = useNavigate();

    // 画面遷移
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
    // タイトルがcontractであった場合に03_contract/index.htmlを呼び出しに行く
    return (
        <iframe
            title="contract"
            src="/03_contract/index.html"
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