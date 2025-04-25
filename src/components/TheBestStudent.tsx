import { CircleUserRound } from "lucide-react"

interface Student {
  id: string;
  name: string;
  score: string;
}

interface ListStudentsProps {
  students?: Student[];
}

export default function TheBestStudent({ students }: ListStudentsProps) {
  const theBest = students?.sort((a, b) => +b.score - +a.score)[0];
  return (
    <div className="col-span-2 row-span-2">
      <div className="border-2 flex justify-center items-center p-1 font-bold text-lg rounded-lg ">
        <p>أفضل طالب</p>
      </div>
      <div className="border-2 flex justify-around mt-2 rounded-lg">
        <div className="flex justify-center items-center flex-col text-lg font-bold">
          <p>الإسم : {theBest?.name}</p>
          <p>النتيجة : {theBest?.score}</p>
        </div>
        <CircleUserRound size={150} strokeWidth={1}/>
      </div>
    </div>
  )
}
