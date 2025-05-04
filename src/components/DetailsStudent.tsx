import { Check, CircleUserRound, Trash2, X } from "lucide-react"
import { useState } from "react";
import { useLocation } from "react-router-dom"
import { MultiValue } from 'react-select';
import data from '../data/data.json'
import SelecteComponent from "./SelecteComponent";
import { db, useGetAssignments } from "../data/db";
import Assignments from "./Assignments";
import { useQueryClient } from "@tanstack/react-query";

interface OptionType {
  value: string;
  label: string;
}

export default function DetailsStudent() {
  const location = useLocation()
  const queryClient = useQueryClient();
  const message = location.state

  const [selectedSurah, setSelectedSurah] = useState<MultiValue<OptionType>>([]);
  const [selectedPart, setSelectedPart] = useState<MultiValue<OptionType>>([]);
  const [selectedPage, setSelectedPage] = useState<MultiValue<OptionType>>([]);
  const [selectedOption, setSelectedOption] = useState<MultiValue<OptionType>>([]);

  const handleClearAll = () => {
    setSelectedSurah([])
    setSelectedPage([])
    setSelectedPart([])
    setSelectedOption([])
  }

  const handleSubmitAssignments = () => {
    const mergedArray = [...selectedSurah, ...selectedPart, ...selectedPage, ...selectedOption]
    mergedArray.forEach(async (surah) => {
      await db.collection('assignments').create({
        revision: surah.label,
        score: 10,
        totalScore: 0,
        teacherid: db.authStore.model?.id,
        studentid: message.idStudent,
        idHalaqa: message.idHalaqa,
      });
      await queryClient.invalidateQueries({ queryKey: ["assignments"]});
      setSelectedSurah([])
      setSelectedPage([])
      setSelectedPart([])
      setSelectedOption([])
    });
  }

  const options = [
    { value: 'apple', label: '🍎 Apple' },
    { value: 'banana', label: '🍌 Banana' },
    { value: 'cherry', label: '🍒 Cherry' },
  ];

  const { data: assignments } = useGetAssignments();
  const total = assignments?.reduce((sum, item) => sum + Number(item.totalScore), 0) ?? 0;
  const targetScore = assignments?.length ? Math.round(total / assignments.length) : 0;
  
  return (
    <div className="w-full h-[var(--height-screen)] bg-gray-200 grid grid-cols-6 grid-rows-6 gap-4 p-2">

      <div className="col-span-4 row-span-6 border-2 border-gray-500 flex flex-col items-center mt-2 rounded-lg">

        {db.authStore.model?.collectionName === "teachers" && 
          <div className="w-full">
            <div className="flex justify-between p-2 w-full mb-4">
              <SelecteComponent 
                options={data.surahs} 
                value={selectedSurah} 
                change={setSelectedSurah} 
                placeHolder="اختار سورة..." 
              />
              <div className="w-full mx-3">
                <SelecteComponent  
                  options={Array.from({ length: 30 }, (_, i) => ({ value: `part-${i + 1}`, label: `جزء ${i + 1}` }))} 
                  value={selectedPart}
                  change={setSelectedPart}
                  placeHolder="اختار جزء..."
                />
              </div>
              <div className="w-full mx-3">
                <SelecteComponent  
                  options={options} 
                  value={selectedOption}
                  change={setSelectedOption}
                  placeHolder="اختار ربع..."
                />
              </div>
              <SelecteComponent  
                options={Array.from({ length: 604 }, (_, i) => ({value: `${i + 1}`,label: `صفحة ${i + 1}`}))} 
                value={selectedPage}
                change={setSelectedPage}
                placeHolder="اختار صفحة..."
              />
            </div>

            <div className="w-11/12 mx-auto h-36 border-2 border-gray-400 rounded-lg flex p-2 relative flex-wrap gap-2 overflow-y-auto">
              <div 
                onClick={handleClearAll}
                className="absolute left-1 text-red-500 cursor-pointer hover:bg-red-400 hover:text-white p-1 rounded-lg hover:shadow-lg"
              >
                <Trash2 />
              </div>
              <div 
                onClick={handleSubmitAssignments}
                className="absolute left-10 text-green-500 cursor-pointer hover:bg-green-400 hover:text-white p-1 rounded-lg hover:shadow-lg"
              >
                <Check />
              </div>
              {selectedSurah.map((item) =>
                <div key={item.value} className="flex justify-center items-center h-fit bg-secondary mx-1 p-1 rounded-xl">
                  <p className="font-bold">{item.label}</p>
                  <X
                    onClick={() =>
                      setSelectedSurah(prev => prev.filter(i => i.value !== item.value))
                    }
                    className="mr-4 text-gray-800 hover:text-red-500 cursor-pointer hover:rotate-90 transition-transform duration-300"
                    size={15}
                    strokeWidth={3}
                  />
                </div>
              )}
              {selectedPart.map((item) =>
                <div key={item.value} className="flex justify-center items-center h-fit mx-1 p-1 rounded-xl bg-secondary">
                  <p className="font-bold">{item.label}</p>
                  <X
                    onClick={() =>
                      setSelectedPart(prev => prev.filter(i => i.value !== item.value))
                    }
                    className="mr-4 text-gray-800 hover:text-red-500 cursor-pointer hover:rotate-90 transition-transform duration-300"
                    size={15}
                    strokeWidth={3}
                  />
                </div>
              )}
              {selectedPage.map((item) =>
                <div key={item.value} className="flex justify-center items-center h-fit bg-secondary mx-1 p-1 rounded-xl">
                  <p className="font-bold">{item.label}</p>
                  <X
                    onClick={() =>
                      setSelectedPage(prev => prev.filter(i => i.value !== item.value))
                    }
                    className="mr-2 ml-1 text-gray-800 hover:text-red-500 cursor-pointer hover:rotate-90 transition-transform duration-300"
                    size={15}
                    strokeWidth={3}
                  />
                </div>
              )}
            </div>
          </div>
        }
        <Assignments idStudent={message.idStudent} idHalaqa={message.idHalaqa}/>
      </div>

      <div className="col-span-2 row-span-2 col-start-5">
        <div className="border-2 border-gray-500 flex justify-around mt-2 rounded-lg">
          <div className="flex justify-center items-center flex-col text-lg font-bold">
            <p>الإسم : {message.name}</p>
            <p>النتيجة : {targetScore}</p>
          </div>
          <CircleUserRound size={150} strokeWidth={1}/>
        </div>
      </div>
    </div>
  )
}
