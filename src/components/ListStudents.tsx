import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  score: string;
  idStudent: string;
}

interface ListStudentsProps {
  students?: Student[];
  nameHalaqa: string;
}

export default function ListStudents({ students , nameHalaqa}: ListStudentsProps) {
  const navigat = useNavigate()
  const handelGoToDetailsStudent = (studentName: string, studentScore: string, studentid: string) => {
    navigat(`/halaqa/${nameHalaqa}/${studentName}`,{
      state: {
        id: studentid,
        name: studentName,
        score: studentScore,
      }
    })
  }
  return (
    <div className="overflow-y-auto h-[390px]">
      {students?.map((item, index) => 
        <div 
          onClick={() => handelGoToDetailsStudent(item.name, item.score, item.idStudent)} key={item.id} 
          className="list-hover-effect relative overflow-hidden flex justify-between p-1 px-3 w-4/5 mx-auto border rounded-lg mb-4 cursor-pointer font-bold"
        >
          <div className="flex">
            <p>{index + 1} -</p>
            <p className="mr-2">{item.name}</p>
          </div>
          <p>{item.score}</p>
        </div>
      )}
    </div>
  )
}
