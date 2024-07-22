import React, { useEffect, useRef } from 'react';

export default function RouteGuide() {
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;

        if (iframe) {
            iframe.src = '/05_map/index.html';
        }

        return () => {
            if (iframe) {
                iframe.src = 'about:blank';
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <div>
                    <img src="/logo.png" alt="ロゴ" style={{ height: '40px' }} />
                </div>
                <div>Consultant_01</div>
            </header>
            <main style={{ flex: 1, padding: '20px' }}>
                <h2>ルート案内</h2>
                <iframe
                    ref={iframeRef}
                    title="route_map"
                    style={{
                        width: "100%",
                        height: "calc(100vh - 120px)", // ヘッダーとパディングを考慮
                        border: "none"
                    }}
                ></iframe>
            </main>
        </div>
    );
}