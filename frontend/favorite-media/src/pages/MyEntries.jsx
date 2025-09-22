import { useEffect, useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function MyEntries() {
  const [entries, setEntries] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      alert('Login first!')
      navigate('/login')
      return
    }
    api.get('/entries/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setEntries(r.data))
  }, [])

  async function deleteEntry(id) {
    if (!window.confirm('Delete this entry?')) return
    try {
      await api.delete(`/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEntries(entries.filter(e => e._id !== id))
    } catch (err) {
      alert('Error deleting')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">My Entries</h2>
          <Link
            to="/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            + Add New
          </Link>
        </div>

        {/* Empty state */}
        {entries.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">No entries yet. Start by adding one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-600 border-collapse">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border border-gray-600">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border border-gray-600">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border border-gray-600">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border border-gray-600">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider border border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900">
                {entries.map(e => (
                  <tr key={e._id} className="border border-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white border border-gray-600">{e.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border border-gray-600">{e.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-300 border border-gray-600">{e.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        e.approved ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                      }`}>
                        {e.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2 border border-gray-600">
                      <Link
                        to={`/edit/${e._id}`}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteEntry(e._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
