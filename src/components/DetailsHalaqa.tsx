import TheBestStudent from "./TheBestStudent"
import { db, useGetHalaqat, useGetDetailsHalaqa } from "../data/db";
import ListStudents from "./ListStudents";
import { useLocation, useNavigate } from "react-router-dom";
import FirstFiveStudents from "./FirstFiveStudents";
import { useEffect, useState } from "react";


export default function DetailsHalaqa() {
  const [notification, setNotification] = useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()
  const message = location.state;

  const { data: DetailsElHalaqat, isLoading, isError, error } = useGetDetailsHalaqa()
  const filterStudents = DetailsElHalaqat?.filter((item) => item.idHalaqa === message.id)
  console.log(filterStudents)

  const { data: ElHalaqat } = useGetHalaqat()
  const filterData = ElHalaqat?.filter((item) => item.user === db.authStore.model?.id).filter((item) => item.name === message.name)[0];

  useEffect(() => {
    if (filterData?.waitingStudents.length === 0) {
      setNotification(false);
    } else {
      setNotification(true);
    }
  }, [filterData?.waitingStudents]);  
  console.log(notification)

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;

  const handleGoToOrderList = () => {
    navigate(`/halaqa/${message.name}/قائمة الطلبات`,{
      state: {
        id: message.id,
        name: message.name
      }
    })
  }

  return (
    <div className="w-full h-[var(--height-screen)] bg-gray-200 grid grid-cols-6 grid-rows-6 gap-4 p-2">
      <div className="col-span-4 row-span-6 flex justify-between items-center flex-col">
        <div className="border-2 border-gray-600 rounded-lg w-full p-2 h-full mb-4">
          <div className="flex flex-col justify-center items-center p-3">
            <p className="font-bold text-2xl mt-3 mb-4">الطلاب</p>
            <hr className="w-2/4 mb-5"/>
          </div>
          <div>
            <ListStudents students={filterStudents} nameHalaqa={message.name} />
          </div>
        </div>
        <p className="text-xl font-bold border-2 border-gray-600 rounded-lg w-full text-center p-2">عدد الطلاب : {filterStudents?.length}</p>
        <button
          onClick={handleGoToOrderList}
          disabled={!notification}
          className={`relative text-xl font-bold border-2 border-gray-600 rounded-lg w-full text-center p-2 mt-5 cursor-pointer`}
        >
          {notification ? 
            <>
              <span className="absolute flex size-4 justify-center items-center ">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9055c8] opacity-75"></span>
                <span className="absolute inline-flex size-3 rounded-full bg-[#725fcc]"></span>
              </span>
              <p>قائمة الطلبات</p>
            </>
            :
            <p>لا يوجد أي طلبات</p>
          }
        </button>
      </div>
      <TheBestStudent students={filterStudents} />
      <FirstFiveStudents students={filterStudents} />
    </div>
  )
}
