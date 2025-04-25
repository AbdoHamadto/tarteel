import { useEffect, useState } from "react";
import { db, useGetAssignments } from "../data/db"
import { Check, X, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Assignments() {
  const queryClient = useQueryClient();
  const [selectScore, setSelectScore] = useState<{ [id: string]: boolean }>({});
  const [score, setScore] = useState<{ [id: string]: number }>({});

  // click for 24 hour
  const [isAvailable, setIsAvailable] = useState<{ [id: string]: boolean }>({});
  const { data: assignments, isLoading, isError, error } = useGetAssignments()

  const checkIfAvailableToday = (id: string): boolean => {
    const lastClicked = localStorage.getItem(`button_last_clicked-${id}`);
    const today = new Date().toISOString().split("T")[0];
    return lastClicked !== today;
  } ;

  useEffect(() => {
    if (!assignments) return;

    const availability: { [id: string]: boolean } = {};
    assignments.forEach((item) => {
      availability[item.id] = checkIfAvailableToday(item.id);
    });

    setIsAvailable(availability);
  }, [assignments]);
  const doTeacher = db.authStore.model?.collectionName === "teachers"

  const handelUpdateScore = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];

    if (!doTeacher && isAvailable[id]) {
      const findAssignments = assignments?.find((item) => item.id === id);
      if (!findAssignments) return;

      await db.collection("assignments").update(id, {
        ...findAssignments,
        totalScore: `${
          +findAssignments.totalScore + 1 >= 10
            ? "10"
            : +findAssignments.totalScore + 1
        }`,
      });

      await queryClient.invalidateQueries({ queryKey: ["assignments"] });

      // بعد التحديث فعلياً
      localStorage.setItem(`button_last_clicked-${id}`, today);
      setIsAvailable((prev) => ({ ...prev, [id]: false }));
      toast("تم تسجيل الدرجة، جرّب تاني بعد 12 صباحاً");
    }

    // الجزء الخاص بالمعلم
    if (doTeacher && selectScore[id]) {
      const findAssignments = assignments?.find((item) => item.id === id);
      if (!findAssignments) return;

      await db.collection("assignments").update(id, {
        ...findAssignments,
        totalScore: `${
          score[id] === undefined ? "0" : score[id] >= 10 ? "10" : score[id]
        }`,
      });

      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
    }
  }

  const handelDeleteAssignments = async (id: string) => {
    await db.collection("assignments").delete(id)
    await queryClient.invalidateQueries({ queryKey: ["assignments"]})
  }

  const handelDeleteAllAssignments = async () => {
    if (!assignments) return;
    await Promise.all(
      assignments.map(item =>
        db.collection("assignments").delete(item.id)
      )
    );
    await queryClient.invalidateQueries({ queryKey: ["assignments"]})
  }

  if (isLoading) return <p className="text-blue-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;
  return (
    <div 
      className={`mx-auto mt-4 border-2 rounded-lg flex flex-col gap-2 overflow-y-auto relative
        ${doTeacher ? "border-gray-400 h-[410px] w-11/12 px-2 pt-4" : "border-transparent h-full w-full"}`}
    >
      {assignments?.map((item, index) => 
        <div 
          key={item.id} 
          className={`flex list-hover-effect relative overflow-hidden justify-between items-center p-1 px-3 min-h-[40px] mx-auto border border-gray-600 rounded-lg mb-1
            ${doTeacher ? "w-4/5 " : "w-11/12"}`}
        >
          <div className="flex">
            <p>{index + 1} -</p>
            <p className="mr-2">{item.revision}</p>
          </div>
          <div dir="ltr">
            {selectScore[item.id] && doTeacher ? (
              <input 
                type="number" 
                min={0}
                max={item.score}
                value={score[item.id] ?? item.totalScore}
                onChange={(e) => {
                  setScore((prev) => ({
                    ...prev,
                    [item.id]: Number(e.target.value),
                  }));
                }}
                className="w-9 h-fit font-bold"
              />
            ) : (
              <span className="mr-2 font-bold">{item.totalScore}</span>
            )}
            <span className="font-bold">/</span>
            <span className="ml-2 font-bold">{item.score}</span>
          </div>
          <div className="flex">
            <div 
              onClick={() => {
                setSelectScore(prev => ({
                  ...prev,
                  [item.id]: !prev[item.id]
                }));
                handelUpdateScore(item.id)
              }}
              className="text-green-500 cursor-pointer hover:bg-green-400 hover:text-white p-1 rounded-lg hover:shadow-lg"
            >
              {isAvailable[item.id] ? (
                  <Check size={20} />
                ) : (
                  <span className="text-xs text-gray-500">غداً</span>
                )}
              
            </div>
            {doTeacher && 
              <div
                onClick={() =>  handelDeleteAssignments(item.id)}
                className="text-red-500 cursor-pointer hover:bg-red-400 hover:text-white p-1 rounded-lg hover:shadow-lg"
              >
                <X size={20} />
              </div>
            }
          </div>
        </div>
      )}
      {db.authStore.model?.collectionName === "teachers" && 
        <div className="sticky bottom-0 bg-gray-200 py-2 mt-auto z-10">
          <div
            onClick={handelDeleteAllAssignments}
            className="flex mb-1 justify-center items-center p-1 px-3 w-2/5 h-fit mx-auto border border-gray-600 rounded-lg hover:border-transparent text-red-500 hover:bg-red-400 hover:text-white cursor-pointer"
          >
            <span className="font-bold">حذف كل المهام</span>
            <Trash2 className="mr-2" />
          </div>
        </div>
      }
    </div>
  )
}
