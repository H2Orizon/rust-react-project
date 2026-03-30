import { BrowserRouter, Routes, Route} from "react-router-dom"
import Resources from "./pages/Resource/Resources"
import Resource from "./pages/Resource/Resource"
import CreateResource from "./pages/Resource/CreateResource"
import Register from "./pages/User/Register"
import Login from "./pages/User/Login"
import AdminPanel from "./pages/AdminPanel"
import MainLayout from "./layouts/MainLayout"
import UserProfile from "./pages/User/User"

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Resources />}/>
        <Route path="/resources/:id" element={<Resource />}/>
        <Route path="/resources/create" element={<CreateResource />}/>
        <Route path="/admin" element={<AdminPanel />}/>
        <Route path="/profile/:id" element={<UserProfile/>}/>
      </Route>

      <Route path="/auth/register" element={<Register />}/>
      <Route path="/auth/login" element={<Login />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
