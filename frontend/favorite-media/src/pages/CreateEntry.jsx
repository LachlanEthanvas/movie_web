import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function CreateEntry(){
  const [title,setTitle] = useState('')
  const [type,setType] = useState('Movie')
  const [desc,setDesc] = useState('')
  const [files,setFiles] = useState([])
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', title)
      formData.append('type', type)
      formData.append('description', desc)
      for(let f of files){
        formData.append('images', f)
      }

      await api.post('/entries', formData, {
        headers:{ Authorization: `Bearer ${token}`, 'Content-Type':'multipart/form-data' }
      })

      alert('Entry created (pending approval)')
      navigate('/')
    } catch(err){
      alert('Error: ' + (err.response?.data?.msg || err.message))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create Entry</h2>
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Title</label>
            <input 
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter title" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              required
            />
          </div>
<br />
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
<br />
          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea 
              rows="4"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Write a short description..." 
              value={desc} 
              onChange={e=>setDesc(e.target.value)} 
            />
          </div>
<br />
          <div>
            <label className="block text-gray-300 text-sm mb-1">Upload Images</label>
            <input 
              type="file" 
              multiple 
              onChange={e=>setFiles(e.target.files)} 
              className="w-full text-gray-300 bg-gray-700 rounded-lg px-2 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
          </div>
<br />
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Create Entry
          </button>
        </form>
      </div>
    </div>
  )
}
