import { Search, BookOpenText } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db, fetchHalaqa, loginHalaqa } from "../data/db";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SearchHalaqa() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState<string>("")
  const { data: ElHalaqat, isLoading, isError, error } = useQuery({
    queryKey: ['halaqa'],   
    queryFn: fetchHalaqa,  
  });

  const filterData = ElHalaqat?.filter((item) => item.halaqa_id?.includes(search) ||  item.name?.includes(search))
  console.log(filterData)

  
  const handelLoginHalaqa = useMutation({
    mutationFn: async ({ halaqaId }: { halaqaId: string }) => {
      const halaqa = ElHalaqat?.find(item => item.id === halaqaId);
      if (!halaqa) throw new Error("الحلقة غير موجودة");
      
      await loginHalaqa(halaqaId, halaqa);
      return halaqa;
    },
    onSuccess: async () => {
      toast.success("تم تسجيل الدخول إلى الحلقة بنجاح");
      await queryClient.invalidateQueries({ queryKey: ["halaqa"] });  
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
    }
  });
  
  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;
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
      <div className="w-full h-[calc(var(--height-screen)-120px)] grid grid-cols-5 gap-6 p-6">
        {filterData?.map((item) => (
          <div key={item.id} className="h-56 rounded-lg bg-secondary card-hover-effect relative overflow-hidden flex justify-center items-center flex-col p-2 transition ease-in-out hover:scale-110">
            <BookOpenText size={100} strokeWidth={1.5} />
            <p><span className="font-bold">إسم الحلقة :</span> {item.name}</p>
            <p><span className="font-bold">رقم السجل :</span> {item.halaqa_id}</p>
            <button 
              onClick={() => handelLoginHalaqa.mutate({halaqaId: item.id})}
              className={`p-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full mt-2 cursor-pointer ${item.waitingStudents.includes(db.authStore.model?.id || "") ? "opacity-90" : 
                item.students.includes(db.authStore.model?.id || "") ? "opacity-85" : "opacity-100"}`}
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
