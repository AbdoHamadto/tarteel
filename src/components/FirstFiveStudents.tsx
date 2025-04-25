interface Student {
  id: string;
  name: string;
  score: string;
}

interface ListStudentsProps {
  students?: Student[];
}

export default function FirstFiveStudents({ students }: ListStudentsProps) {
  const FirstStudents = students?.sort((a, b) => +b.score - +a.score).slice(0, 5);
  return (
    <div className="col-span-2 col-start-5 row-span-4 row-start-3 border-2 rounded-lg overflow-y-auto">
      <div className="flex flex-col justify-center items-center p-3">
        <p className="font-bold text-2xl mt-3 mb-4">لوحة الشرف</p>
        <hr className="w-2/4"/>
      </div>
      <div className="mt-3">
        <div className="flex justify-between p-2 w-4/5 mx-auto border  rounded-lg mb-4 font-bold">
          <p className="mr-8">الإسم</p>
          <p>المجموع</p>
        </div>
        {FirstStudents?.map((item, index) => 
          <div key={item.id} className="list-hover-effect relative overflow-hidden flex justify-between p-2 w-4/5 mx-auto border font-bold rounded-lg mb-4">
            <div className="flex">
              <p>{index + 1} -</p>
              <p className="mr-2">{item.name}</p>
            </div>
            <p>{item.score}</p>
          </div>
        )}
      </div>
    </div>
  )
}
