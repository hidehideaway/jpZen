import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Consultant from "./routes/consultant";
import ClientList from "./routes/client_list";
import Contract from "./routes/contract";
import RouteGuide from "./routes/route_guide";
import FamilyTree from "./routes/family_tree";
import Register from "./routes/register";
import NewFamily from "./routes/new_family";

import './App.css';

// ここでルーティング設定をする
// path: URLのパス element: 呼び出し先モジュール（routes/***.jsの中のfunctionをimportして指定している）
function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Navigate to="/consultant" />} />
          <Route path='/consultant' element={<Consultant />} />
          <Route path='/clientlist' element={<ClientList />} />
          <Route path='/contract' element={<Contract />} />
          <Route path='/family_tree' element={<FamilyTree />} />
          <Route path="/route_guide" element={<RouteGuide />} />
          <Route path="/register" element={<Register />} />          
          <Route path="/new_family" element={<NewFamily />} />          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
