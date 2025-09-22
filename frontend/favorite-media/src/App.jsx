import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateEntry from './pages/CreateEntry'
import Navbar from './components/Navbar'
import AdminPage from './pages/AdminPage'
import MyEntries from './pages/MyEntries'
import EditEntry from './pages/EditEntry'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateEntry />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/my" element={<MyEntries />} />
        <Route path="/edit/:id" element={<EditEntry />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
