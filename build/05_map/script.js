function initMap() {
    const map = L.map('map').setView([35.6895, 139.6917], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const waypoints = [
        [35.6812, 139.7649], // 現在地：大手町プレイスウエストタワー
        [35.6939, 139.7534], // 経由地1：千代田区役所
        [35.6659, 139.7729], // 経由地2：中央区役所
        [35.6587, 139.7454], // 経由地3：港区役所
        [35.6894, 139.6917]  // 目的地：東京都庁
    ];

    // マーカーを追加
    waypoints.forEach((point, index) => {
        L.marker(point).addTo(map)
            .bindPopup(index === 0 ? '現在地' : index === waypoints.length - 1 ? '目的地' : `経由地${index}`);
    });

    // ルートを描画
    const latlngs = waypoints.map(point => L.latLng(point[0], point[1]));
    const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);

    // マップの表示範囲を調整
    map.fitBounds(polyline.getBounds());
}

// グローバルスコープに initMap 関数を公開
window.initMap = initMap;