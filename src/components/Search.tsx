import { Search, BookOpenText } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import { db, fetchHalaqa, loginHalaqa } from "../data/db";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SearchHalaqa() {
  const [search, setSearch] = useState<string>("")
  const { data: ElHalaqat, isLoading, isError, error } = useQuery({
    queryKey: ['halaqa'],   
    queryFn: fetchHalaqa,  
  });

  const filterData = ElHalaqat?.filter((item) => item.halaqa_id?.includes(search) ||  item.name?.includes(search))
  console.log(filterData)

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;
  
  
  const handelLoginHalaqa = async (halaqaId: string) => {
    const halaqa = ElHalaqat?.filter((item) => item.id === halaqaId)[0]
    loginHalaqa(halaqaId, halaqa)
    toast("تم تسجيل الدخول الي الحلقة")
  }

  return (
    <div>
      <div className="w-full h-30 flex justify-center items-center">
        <input 
          type="text" 
          placeholder="ابحث عن الحلقات" 
          className="w-4/5 max-w-[900px] outline-none border-2 border-gray-600 rounded-r-lg p-1 text-lg " 
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="text-gray-700 border-r-0 border-2 border-gray-600 h-10 rounded-l-lg cursor-pointer"/>
      </div>
      <div className="w-full h-[calc(100vh-180)] grid grid-cols-5 gap-4 p-2">
        {filterData?.map((item) => (
          <div key={item.id} className="h-56 rounded-lg bg-[#725fcc] hover:bg-[#7764d9] flex justify-center items-center flex-col p-2">
            <BookOpenText size={100} strokeWidth={1.5} />
            <p><span className="font-bold">إسم الحلقة :</span> {item.name}</p>
            <p><span className="font-bold">رقم السجل :</span> {item.halaqa_id}</p>
            {/* ask chatGPT if the button code is a best or no */}
            <button 
              onClick={() => handelLoginHalaqa(item.id)}
              className="p-2 w-full bg-accent rounded-full mt-2 hover:bg-[#be91c7] cursor-pointer"
              disabled={item.waitingStudents.includes(db.authStore.model?.id || "") ? true : item.students.includes(db.authStore.model?.id || "") && true}
            >
              {
                item.waitingStudents.includes(db.authStore.model?.id || "") ? "تم ارسال طلب الانضمام" : 
                item.students.includes(db.authStore.model?.id || "") ? "تم انضمامك" : "دخول الحلقة"
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
