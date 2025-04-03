import { Menu, X,  CircleUserRound, BookOpenText } from "lucide-react"
import { useState } from "react"
import { db } from "../data/db"
import { useNavigate } from 'react-router-dom';
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
      <nav className="w-full h-10 flex justify-center items-center bg-[#725fcc]">
        <div className="w-11/12 mx-auto flex justify-between">
          <div>
            {db.authStore.model?.collectionName === "teachers" ?
              <>
                <a href="/search">معلم</a>
                <a href="/search" className="mx-2">معلم</a>
                <a href="/search">معلم</a>
              </> 
              :
              <>
                <a href="/search">البحث</a>
                <a href="/search" className="mx-2">البحث</a>
                <a href="/search">البحث</a>
              </>
            }
          </div>
          <div className="flex">
            <a href="/" className="flex ml-8 justify-center items-center">
              <p className="font-bold ml-1">ترتيل</p>
              <BookOpenText size={20}/>
            </a>
            {sideBar ? 
              <X className="cursor-pointer" onClick={() => setSideBar(!sideBar)} />
              :
              <Menu className="cursor-pointer" onClick={() => setSideBar(!sideBar)}/> 
            }
          </div>
        </div>
      </nav>
      <div className={`h-screen w-70 bg-[#9055c8] fixed left-0 top-0 z-10 transition-all duration-500 overflow-auto ${sideBar ? ' translate-0' : '-translate-x-full'}`}>
        <div className="w-full h-10 bg-[#725fcc] flex justify-center items-center">
          <div className="flex w-3/5 mx-auto justify-end">
            <a href="/" className="flex ml-8 justify-center items-center cursor-pointer">
              <p className="font-bold ml-1">ترتيل</p>
              <BookOpenText size={20}/>
            </a>
            {sideBar ? 
              <X className="cursor-pointer" onClick={() => setSideBar(!sideBar)} />
              :
              <Menu className="cursor-pointer" onClick={() => setSideBar(!sideBar)}/> 
            }
          </div>
        </div>
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
          <button className="w-4/5 cursor-pointer text-center p-1 rounded-lg mt-3 bg-blue-700" onClick={handelLogOut}>تسجيل الخروج</button>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
