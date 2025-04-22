import { useNavigate } from "react-router-dom";
import { db, useGetDetailsHalaqa, useGetHalaqat } from "../data/db"
import { BookOpenText, Search } from "lucide-react";

export default function SubscribeEducational() {
  const { data: ElHalaqat, isLoading, isError, error } = useGetHalaqat()
  const userId = db.authStore.model?.id
  const filterData = ElHalaqat?.filter((item) => item.students.includes(userId || ""))

  const { data: DetailsElHalaqat} = useGetDetailsHalaqa()
  const filterStudents = DetailsElHalaqat?.filter((item) => item.idStudent === db.authStore.model?.id)[0]
  console.log(filterStudents)

  const navigate = useNavigate()

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;

  const handelGoToDetailsStudent = (halaqaName: string) => {
    navigate(`/halaqa/${halaqaName}`,{
      state: {
        name: filterStudents?.name,
        score: filterStudents?.score,
      }
    })
  }

  return (
    <>
      {filterData?.length === 0 ? 
        <div className="w-full h-[var(--height-screen)] flex flex-col justify-center items-center bg-background">
          <p className="text-xl font-bold text-gray-600 mb-1">انت غير مشترك في اي حلقه</p>
          <a href="/search" className="text-lg text-gray-500 cursor-pointer flex">
            <p>اضغط هنا للبحث عن حلقات</p>
            <Search size={25}/>
          </a>
        </div>
        :
        <div className="w-full h-[var(--height-screen)] bg-background grid grid-cols-5 gap-6 p-6" >
          {
            filterData?.map((item) => (
              <div     
                key={item.id} 
                onClick={() => handelGoToDetailsStudent(item.name)}
                className="h-50 rounded-lg bg-secondary hover:bg-hoverbg cursor-pointer flex justify-center items-center flex-col transition ease-in-out hover:scale-110"
              >
                <BookOpenText size={100} strokeWidth={1.5} />
                <p><span className="font-bold">إسم الحلقة :</span> {item.name}</p>
                <p><span className="font-bold">رقم السجل :</span> {item.halaqa_id}</p>
              </div>
            ))
          }
        </div>
      }
    </>
  )
}
