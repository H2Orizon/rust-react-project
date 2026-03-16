import { BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Resources from "./pages/Resources"
import Resource from "./pages/Resource"
import CreateResource from "./pages/CreateResource"
import Register from "./pages/Register"
import Login from "./pages/login"

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Resources />}/>
      <Route path="/resources/:id" element={<Resource />}/>
      <Route path="/resources/create" element={<CreateResource />}/>
      <Route path="/auth/register" element={<Register />}/>
      <Route path="/auth/login" element={<Login />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
