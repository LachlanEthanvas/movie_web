import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function EditEntry(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [title,setTitle] = useState('')
  const [type,setType] = useState('Movie')
  const [desc,setDesc] = useState('')
  const token = localStorage.getItem('token')

  useEffect(()=>{
    api.get(`/entries/${id}`).then(r=>{
      setTitle(r.data.title)
      setType(r.data.type)
      setDesc(r.data.description || '')
    })
  },[id])

  async function submit(e){
    e.preventDefault()
    try {
      await api.patch(`/entries/${id}`, { title, type, description: desc }, {
        headers:{ Authorization:`Bearer ${token}` }
      })
      alert('Updated!')
      navigate('/my')
    } catch(err){
      alert('Error updating')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Edit Entry</h2>
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Title</label>
            <input 
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Type</label>
            <select 
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={type} 
              onChange={e=>setType(e.target.value)}
            >
              <option>Movie</option>
              <option>TV Show</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea 
              rows="4"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={desc} 
              onChange={e=>setDesc(e.target.value)} 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
