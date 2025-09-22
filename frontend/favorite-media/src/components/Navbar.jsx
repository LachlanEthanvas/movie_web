import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  function logout(){
    localStorage.clear()
    navigate('/')
  }

  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      {!token && <Link to="/login">Login</Link>} |{" "}
      {!token && <Link to="/register">Register</Link>} |{" "}
      {token && <Link to="/create">Create Entry</Link>} |{" "}
      {role === 'admin' && <Link to="/admin">Admin</Link>} |{" "}
      {token && <Link to="/my">My Entries</Link>} |{" "}
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  )
}
