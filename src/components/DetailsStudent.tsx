import { CircleUserRound } from "lucide-react"
import { useState } from "react";
import { useLocation } from "react-router-dom"
import Select, { MultiValue } from 'react-select';
import data from '../data/data.json'

interface OptionType {
  value: string;
  label: string;
}

export default function DetailsStudent() {
  const [selectedOption, setSelectedOption] = useState<MultiValue<OptionType>>([]);
  const [selectedPage, setSelectedPage] = useState<MultiValue<OptionType>>([]);
  const [selectedPart, setSelectedPart] = useState<MultiValue<OptionType>>([]);

  // console.log(selectedOption)
  const location = useLocation()
  const message = location.state

  const options = [
    { value: 'apple', label: '🍎 Apple' },
    { value: 'banana', label: '🍌 Banana' },
    { value: 'cherry', label: '🍒 Cherry' },
  ];
  
  return (
    <div className="w-full h-[calc(100vh-40px)] bg-gray-200 grid grid-cols-6 grid-rows-6 gap-4 p-2">

      <div className="col-span-4 row-span-6 border-2 border-gray-500 flex flex-col items-center mt-2 rounded-lg">

        <div className="flex justify-between p-2 w-full mb-4">
          <Select 
            options={data.surahs} 
            onChange={setSelectedOption}
            components={{ ClearIndicator: () => null }}
            className="w-full"
            isMulti
            placeholder="اختار سورة..."
            styles={{
              multiValueLabel: () => ({
                display: "none"
              }),
              multiValueRemove: () => ({
                display: "none"
              }),
              clearIndicator: () => ({
                display: "none"
              })
            }}
          />

          <div className="w-full mx-3">
            <Select 
              options={Array.from({ length: 30 }, (_, i) => ({ value: `part-${i + 1}`, label: `جزء ${i + 1}` }))} 
              onChange={setSelectedPart}
              components={{ ClearIndicator: () => null }}
              className="w-full"
              isMulti
              placeholder="اختار جزء..."
              styles={{
                multiValueLabel: () => ({
                  display: "none"
                }),
                multiValueRemove: () => ({
                  display: "none"
                })
              }}
            />
          </div>

          <div className="w-full mx-3">
            <Select 
              options={options} 
              onChange={setSelectedOption}
              components={{ ClearIndicator: () => null }}
              className="w-full"
              isMulti
              placeholder="اختار ربع..."
              styles={{
                multiValueLabel: () => ({
                  display: "none"
                }),
                multiValueRemove: () => ({
                  display: "none"
                })
              }}
            />
          </div>

          <Select 
            options={Array.from({ length: 604 }, (_, i) => ({value: `${i + 1}`,label: `صفحة ${i + 1}`}))} 
            onChange={setSelectedPage}
            components={{ ClearIndicator: () => null }}
            className="w-full"
            isMulti
            placeholder="اختار صفحة..."
            styles={{
              multiValueLabel: () => ({
                display: "none"
              }),
              multiValueRemove: () => ({
                display: "none"
              })
            }}
          />
        </div>
        <div className="w-11/12 border-2 border-gray-400 h-full rounded-lg">
          {selectedPart.map((item) =><p className="flex">{item.label}</p>)}
          {selectedOption.map((item) =><p className="flex">{item.label}</p>)}
          {selectedPage.map((item) =><p className="flex">{item.label}</p>)}
        </div>

        {/* student here */}
      </div>

      <div className="col-span-2 row-span-2 col-start-5">
        <div className="border-2 border-gray-500 flex justify-around mt-2 rounded-lg">
          <div className="flex justify-center items-center flex-col text-lg font-bold">
            <p>الإسم : {message.name}</p>
            <p>النتيجة : {message.score}</p>
          </div>
          <CircleUserRound size={150} strokeWidth={1}/>
        </div>
      </div>
    </div>
  )
}
