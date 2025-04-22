import { useLocation } from "react-router-dom";
import { useGetHalaqat, db, useGetUserStudents, moveStudentsFromWaiting, removeStudentsFromWaiting } from "../data/db";
import { Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function OrderList() {
  const location = useLocation()
  const message = location.state
  const queryClient = useQueryClient()
  
  const { data: ElHalaqat, isLoading, isError, error } = useGetHalaqat()
  const { data: userStudents } = useGetUserStudents()
  const filteredHalaqa = ElHalaqat?.find(
    (item) =>
      item.user === db.authStore.model?.id &&
      item.name === message?.name
  );
  
  const moveStudentMutation = useMutation({
    mutationFn: async ({studentId ,name} : {studentId: string, name: string | undefined}) => {
      if (!filteredHalaqa) return;
      const updatedWaiting = filteredHalaqa.waitingStudents.filter((id) => id !== studentId);
      const data = {
        name: name,
        idHalaqa: message.id,
        idStudent: studentId,
        score: "0",
      }
      db.collection("detailsHalaqa").create(data)
      await moveStudentsFromWaiting(message.id, filteredHalaqa, updatedWaiting, studentId)
    },
    onSuccess: async () => {
      toast.success("تم تسجيل الحساب بنجاح! 🎉");
      await queryClient.invalidateQueries({ queryKey: ["halaqa"] });
    },
    onError: (error: any) => {
      alert(`حدث خطأ أثناء التسجيل: ${error.message}`);
    },
  });
  
  const addStudentToHalaqa = (studentId: string ,name: string | undefined) => {
    moveStudentMutation.mutate({ studentId, name})
  }
  
  const removeStudentMutation = useMutation({
    mutationFn: async ({studentId} : {studentId: string}) => {
      if (!filteredHalaqa) return;
      const updatedWaiting = filteredHalaqa.waitingStudents.filter((id) => id !== studentId);
      await removeStudentsFromWaiting(message.id, filteredHalaqa, updatedWaiting)
    },
    onSuccess: async () => {
      toast.success("تم الحذف بنجاح")
      await queryClient.invalidateQueries({ queryKey: ["halaqa"] });
    },
    onError: (error: any) => {
      alert(`حدث خطأ أثناء التسجيل: ${error.message}`);
    }
  })
  
  const removeStudent = (studentId: string) => {
    removeStudentMutation.mutate({studentId})
  }

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;
  
  return (
    <div className="w-full h-[var(--height-screen)] bg-gray-200 flex justify-center p-2">
      <div className="w-[900px] max-w-4/5 h-full border-2 border-gray-600 rounded-lg overflow-y-auto">
        <div className="flex flex-col justify-center items-center p-3">
          <p className="font-bold text-2xl mt-3 mb-4">قائمة الطلبات</p>
          <hr className="w-2/4 mb-5"/>
        </div>
        {filteredHalaqa?.waitingStudents.map((item, index) => {
          const student = userStudents?.find((i) => i.id === item);
          return (
            <div key={index} className="flex justify-between p-2 w-4/5 mx-auto border border-gray-600 rounded-lg mb-4">
              <div className="flex justify-between w-full">
                <div className="flex">
                  <p>{index + 1} -</p>
                  <p className="mr-2">{student?.name}</p>
                </div>
                <div className="flex">
                  <div onClick={() => addStudentToHalaqa( item ,student?.name)} className="hover:bg-green-400 rounded-lg size-7 flex justify-center items-center text-green-600 cursor-pointer hover:text-white">
                    <Check />
                  </div>
                  <div onClick={() => removeStudent(item)} className="hover:bg-red-400 rounded-lg size-7 flex justify-center items-center text-red-600 cursor-pointer hover:text-white mr-3">
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
