const API_BASE_URL = 'http://35.79.74.81:8080';

// React Router の BrowserRouter を使用
const { BrowserRouter } = ReactRouterDOM;

// React コンポーネントをレンダリング
ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <FamilyTree />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);