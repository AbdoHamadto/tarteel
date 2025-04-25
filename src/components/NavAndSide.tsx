import { Menu, X,  CircleUserRound, BookOpenText } from "lucide-react"
import { useState } from "react"
import { db } from "../data/db"
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";

export default function NavAndSide() {
  const [sideBar, setSideBar] = useState<boolean>(false)
  const navigate = useNavigate();

  const handelLogOut = () => {
    db.authStore.clear();
    navigate('/auth')
  }
  return (
    <div>
      <nav className="w-full h-14 flex justify-center items-center bg-primary">
        <div className="w-11/12 mx-auto flex justify-between items-center px-4">
          <div>
            {db.authStore.model?.collectionName === "students" && <Link to="/search" className="mx-2 text-xl font-bold">البحث</Link>}
          </div>
          <div className="flex">
            <Link to="/" className="flex ml-8 justify-center items-center">
              <p className="font-bold ml-1 text-2xl">ترتيل</p>
              <BookOpenText size={30}/>
            </Link>
            {sideBar ? 
              <X size={30} className="cursor-pointer" onClick={() => setSideBar(!sideBar)} />
              :
              <Menu size={30} className="cursor-pointer" onClick={() => setSideBar(!sideBar)}/> 
            }
          </div>
        </div>
      </nav>
      <div className={`h-[var(--height-screen)] w-70 bg-secondary fixed left-0 bottom-0 z-10 transition-all duration-500 overflow-auto ${sideBar ? ' translate-0' : '-translate-x-full'}`}>
        <div className="flex justify-center items-center flex-col">
          <div className="w-full flex justify-center items-center flex-col mt-4">
            <CircleUserRound size={100} strokeWidth={0.7}/>
            {db.authStore.model?.collectionName === "teachers" ?
              `المعلم: ${db.authStore.model?.name}`
              :
              `الطالب: ${db.authStore.model?.name}`
            }
            <p>الإيميل: {db.authStore.model?.email}</p>
          </div>
          <button className="w-4/5 cursor-pointer text-center rounded-lg mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold p-2" onClick={handelLogOut}>تسجيل الخروج</button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
