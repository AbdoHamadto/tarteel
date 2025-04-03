import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  score: string;
}

interface ListStudentsProps {
  students?: Student[];
  nameHalaqa: string;
}

export default function ListStudents({ students , nameHalaqa}: ListStudentsProps) {
  const navigat = useNavigate()
  const handelGoToDetailsStudent = (studentName: string, studentScore: string) => {
    navigat(`/halaqa/${nameHalaqa}/${studentName}`,{
      state: {
        name: studentName,
        score: studentScore,
      }
    })
  }
  return (
    <div>
      {students?.map((item, index) => 
        <div onClick={() => handelGoToDetailsStudent(item.name, item.score)} key={item.id} className="flex justify-between p-2 w-4/5 mx-auto border border-gray-600 rounded-lg mb-4 hover:bg-gray-300 cursor-pointer">
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
