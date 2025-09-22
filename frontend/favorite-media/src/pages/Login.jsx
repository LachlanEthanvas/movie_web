import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', { email, password: pass })
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      alert('Logged in!')
      navigate('/')
    } catch(err){
      alert('Error: ' + (err.response?.data?.msg || 'Something went wrong'))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input 
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="you@example.com" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required
            />
          </div>
           <br />
          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input 
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••" 
              value={pass} 
              onChange={e=>setPass(e.target.value)} 
              required
            />
          </div>
           <br />
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
