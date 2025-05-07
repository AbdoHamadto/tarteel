import { CircleUserRound } from "lucide-react"
import { db, useGetDetailsHalaqa } from "../data/db";
import { useLocation } from "react-router-dom";

interface ListProps {
  idStudent: string;
  idHalaqa: string;
}

export default function ScoreStudent({idStudent, idHalaqa} : ListProps) {
  const location = useLocation()
  const message = location.state

  const {data} = useGetDetailsHalaqa()
  const finalIdStudent = idStudent || db.authStore.model?.id || '';
  const finalIdHalaqa = idHalaqa || message.idHalaqa || '';
  const filterStudent = data?.filter(
    (item) => 
      item.idHalaqa.includes(finalIdHalaqa) &&
      item.idStudent.includes(finalIdStudent)
  )[0]

  return (
    <div className="col-span-2 row-span-2 col-start-5">
      <div className="border-2 border-gray-500 flex justify-around mt-2 rounded-lg">
        <div className="flex justify-center items-center flex-col text-lg font-bold">
          <p>الإسم : {filterStudent?.name}</p>
          <p>النتيجة : {filterStudent?.score}</p>
        </div>
        <CircleUserRound size={150} strokeWidth={1}/>
      </div>
    </div>
  )
}
