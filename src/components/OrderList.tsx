import { useLocation } from "react-router-dom";
import { useGetHalaqat, db, useGetUserStudents, moveStudentsFromWaiting, removeStudentsFromWaiting } from "../data/db";
import { Check, X } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";

export default function OrderList() {
  const location = useLocation()
  const message = location.state

  const { data: ElHalaqat, isLoading, isError, error } = useGetHalaqat()
  const filterData = ElHalaqat?.filter((item) => item.user === db.authStore.model?.id).filter((item) => item.name === message.name)[0]
  
  const { data: userStudents } = useGetUserStudents()

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;

  // const moveStudent = useMutation({
  //   mutationFn: ({studentId ,name} : {studentId: string, name: string | undefined}) =>
  //     const filterRecorde = ElHalaqat?.filter((item) => item.id === message.id)[0]
  //     const updateRecord = ElHalaqat?.filter((item) => item.id === message.id)[0].waitingStudents.filter((item) => item !== studentId)

  //     console.log(updateRecord)
  //     const data = {
  //       name: name,
  //       idHalaqa: message.id,
  //       score: "0",
  //     }
  //     db.collection("detailsHalaqa").create(data)
  //     moveStudentsFromWaiting(message.id, filterRecorde, updateRecord)
  //   ,
  //   onSuccess: () => {
  //     toast.success("تم تسجيل الحساب بنجاح! 🎉");
  //   },
  //   onError: (error: any) => {
  //     alert(`حدث خطأ أثناء التسجيل: ${error.message}`);
  //   },
  // });

  const addStudentToHalaqa = (studentId: string ,name: string | undefined) => {
    // useMutation(studentId, name)
    const filterRecorde = ElHalaqat?.filter((item) => item.id === message.id)[0]
    const updateRecord = ElHalaqat?.filter((item) => item.id === message.id)[0].waitingStudents.filter((item) => item !== studentId)

    console.log(updateRecord)
    const data = {
      name: name,
      idHalaqa: message.id,
      score: "0",
    }
    db.collection("detailsHalaqa").create(data)
    moveStudentsFromWaiting(message.id, filterRecorde, updateRecord, studentId)
  }

  const removeStudent = (studentId: string) => {
    const filterRecorde = ElHalaqat?.filter((item) => item.id === message.id)[0]
    const updateRecord = ElHalaqat?.filter((item) => item.id === message.id)[0].waitingStudents.filter((item) => item !== studentId)
    removeStudentsFromWaiting(message.id, filterRecorde, updateRecord)
  }

  return (
    <div className="w-full h-[calc(100vh-40px)] bg-gray-200 flex justify-center p-2">
      <div className="w-[900px] max-w-4/5 h-full border-2 border-gray-600 rounded-lg overflow-y-auto">
        <div className="flex flex-col justify-center items-center p-3">
          <p className="font-bold text-2xl mt-3 mb-4">قائمة الطلبات</p>
          <hr className="w-2/4 mb-5"/>
        </div>
        {filterData?.waitingStudents.map((item, index) => {
          const student = userStudents?.find((i) => i.id === item);
          return (
            <div key={index} className="flex justify-between p-2 w-4/5 mx-auto border border-gray-600 rounded-lg mb-4 ">
              <div className="flex justify-between w-full">
                <div className="flex">
                  <p>{index + 1} -</p>
                  <p className="mr-2">{student?.name}</p>
                </div>
                <div className="flex">
                  <div onClick={() => addStudentToHalaqa(item ,student?.name)} className="bg-green-600 rounded-lg size-7 flex justify-center items-center text-white cursor-pointer hover:bg-green-500">
                    <Check />
                  </div>
                  <div onClick={() => removeStudent(item)} className="bg-red-600 rounded-lg size-7 flex justify-center items-center text-white cursor-pointer hover:bg-red-500 mr-3">
                    <X />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
