import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultant() {
    const navigate = useNavigate();

    // 画面遷移
    // public/01_consultant/script.jsのnavigateToClientList()関数が呼ばれたらuseEffictの処理が動き画面遷移する
    // navigate先の/clientlistのパスのルーティング設定は、App.jsで設定済み
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'navigateToClientList') {
                navigate('/clientlist');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    return (
        <iframe
            title="conslutant"
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