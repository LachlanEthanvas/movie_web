import { useEffect, useState } from 'react'
import api from '../api'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSearchParams } from 'react-router-dom'
import FiltersBar from '../components/FiltersBar'

export default function Home(){
  const [items,setItems] = useState([])
  const [cursor,setCursor] = useState(null)
  const [hasMore,setHasMore] = useState(true)
  const [searchParams] = useSearchParams()

  // Reset list when filters change
  useEffect(()=>{
    setItems([])
    setCursor(null)
    setHasMore(true)
    fetchMore(true)
  },[searchParams])

  async function fetchMore(reset=false){
    const params = { limit: 5 }
    if(cursor && !reset) params.cursor = cursor

    if(searchParams.get('q')) params.q = searchParams.get('q')
    if(searchParams.get('type')) params.type = searchParams.get('type')

    const {data} = await api.get('/entries', { params })
    if(reset){
      setItems(data.items)
    }else{
      setItems(prev => [...prev, ...data.items])
    }
    setCursor(data.nextCursor)
    if(!data.nextCursor) setHasMore(false)
  }

  return (
    <div>
      <h2>Public Feed</h2>
      <FiltersBar />
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
        endMessage={<p>No more entries ✨</p>}
      >
        {items.map(i=>(
          <div key={i._id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>
            <h3>Title:{i.title} ({i.type})</h3>
            <p>Description:{i.description}</p>
            {i.images && i.images.map(img=> (
              <img key={img.url} src={`http://localhost:4000${img.thumbUrl}`} alt="" width="150" />
            ))}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}
