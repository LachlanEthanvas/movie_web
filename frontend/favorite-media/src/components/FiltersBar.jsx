import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function FiltersBar(){
  const [searchParams,setSearchParams] = useSearchParams()
  const [q,setQ] = useState(searchParams.get('q') || '')
  const [type,setType] = useState(searchParams.get('type') || '')

  function applyFilters(e){
    e.preventDefault()
    const params = {}
    if(q) params.q = q
    if(type) params.type = type
    setSearchParams(params)
  }

  // When URL changes (e.g., back/forward buttons)
  useEffect(()=>{
    setQ(searchParams.get('q') || '')
    setType(searchParams.get('type') || '')
  },[searchParams])

  return (
    <form onSubmit={applyFilters} style={{marginBottom:"10px"}}>
      <input 
        placeholder="Search by title/description" 
        value={q} 
        onChange={e=>setQ(e.target.value)} 
      />
      <select value={type} onChange={e=>setType(e.target.value)}>
        <option value="">All</option>
        <option value="Movie">Movie</option>
        <option value="TV Show">TV Show</option>
      </select>
      <button>Apply</button>
    </form>
  )
}
