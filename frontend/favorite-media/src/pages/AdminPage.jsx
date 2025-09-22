import { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function AdminPage(){
  const [pending,setPending] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  // Load pending entries
  useEffect(()=>{
    if(!token || role !== 'admin'){
      alert('Admins only')
      navigate('/')
      return
    }
    api.get('/entries/pending', {
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(r=> setPending(r.data))
    .catch(err=> alert('Error: ' + err.response?.data?.msg || err.message))
  },[])

  // Approve entry
  async function approve(id){
    try{
      await api.patch(`/entries/${id}/approve`, {}, {
        headers:{ Authorization:`Bearer ${token}` }
      })
      setPending(pending.filter(p=> p._id !== id))
      alert('Approved!')
    }catch(err){
      alert('Error approving')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Pending Entries</h2>

        {pending.length === 0 && (
          <p className="text-gray-400 text-center">No pending entries 🎉</p>
        )}

        <div className="grid gap-6">
          {pending.map(p=>(
            <div 
              key={p._id} 
              className="bg-gray-800 rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {p.title} <span className="text-sm text-gray-400">({p.type})</span>
                </h3>
                <p className="text-gray-300 mt-1">{p.description}</p>
              </div>

              <div className="mt-4 sm:mt-0 flex gap-3">
                <button 
                  onClick={()=>approve(p._id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
