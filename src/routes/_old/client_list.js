import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultant() {
    const navigate = useNavigate();

    // 画面遷移
    // public/02_client_list/script.jsのnavigateToContract()関数が呼ばれたらuseEffictの処理が動き画面遷移する
    // navigate先の/contractのパスのルーティング設定は、App.jsで設定済み
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'navigateToContract') {
                navigate('/contract');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    return (
        <iframe
            title="client_list"
            src="/02_client_list/index.html"
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