import {db} from '../data/db'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();


  const handelLogOut = () => {
    db.authStore.clear();
    navigate('/auth')
  }

  return (
    <>
    <div className="w-full h-44 flex items-center justify-center">
        <p className="font-bold text-blue-500 text-2xl">Hello World</p>
        <button onClick={handelLogOut}>log out</button>
      </div>
    </>
  )
}
