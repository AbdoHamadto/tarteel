import { Check, CircleUserRound, Trash2, X } from "lucide-react"
import { useState } from "react";
import { useLocation } from "react-router-dom"
import Select, { MultiValue } from 'react-select';
import data from '../data/data.json'

interface OptionType {
  value: string;
  label: string;
}

export default function DetailsStudent() {
  const location = useLocation()
  const message = location.state

  const [selectedSurah, setSelectedSurah] = useState<MultiValue<OptionType>>([]);
  const [selectedPart, setSelectedPart] = useState<MultiValue<OptionType>>([]);
  const [selectedPage, setSelectedPage] = useState<MultiValue<OptionType>>([]);
  const [selectedOption, setSelectedOption] = useState<MultiValue<OptionType>>([]);

  const handelClearAll = () => {
    setSelectedSurah([])
    setSelectedPage([])
    setSelectedPart([])
    setSelectedOption([])
  }

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
            value={selectedSurah}
            onChange={setSelectedSurah}
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
              value={selectedPart}
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
              value={selectedOption} 
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
            value={selectedPage}
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
        <div className="w-11/12 min-h-30 border-2 border-gray-400 rounded-lg flex p-2 relative flex-wrap gap-2">
          <div 
            onClick={handelClearAll}
            className="absolute left-1 text-red-500 cursor-pointer hover:bg-red-400 hover:text-white p-1 rounded-lg hover:shadow-lg"
          >
            <Trash2 />
          </div>
          <div 
            onClick={handelClearAll}
            className="absolute left-10 text-green-500 cursor-pointer hover:bg-green-400 hover:text-white p-1 rounded-lg hover:shadow-lg"
          >
            <Check />
          </div>
          {selectedSurah.map((item) =>
            <div key={item.value} className="flex justify-center items-center h-fit bg-gray-300 mx-1 p-1 rounded-xl">
              <p className="text-gray-700">{item.label}</p>
              <X
                onClick={() =>
                  setSelectedSurah(prev => prev.filter(i => i.value !== item.value))
                }
                className="mr-4 text-gray-500 hover:text-red-500 cursor-pointer hover:rotate-90 transition-transform duration-300"
                size={15}
                strokeWidth={3}
              />
            </div>
          )}
          {selectedPart.map((item) =>
            <div key={item.value} className="flex justify-center items-center h-fit bg-gray-300 mx-1 p-1 rounded-xl">
              <p className="text-gray-700">{item.label}</p>
              <X
                onClick={() =>
                  setSelectedPart(prev => prev.filter(i => i.value !== item.value))
                }
                className="mr-4 text-gray-500 hover:text-red-500 cursor-pointer hover:rotate-90 transition-transform duration-300"
                size={15}
                strokeWidth={3}
              />
            </div>
          )}
          {selectedPage.map((item) =>
            <div key={item.value} className="flex justify-center items-center h-fit bg-gray-300 mx-1 p-1 rounded-xl">
              <p className="text-gray-700">{item.label}</p>
              <X
                onClick={() =>
                  setSelectedPage(prev => prev.filter(i => i.value !== item.value))
                }
                className="mr-4 text-gray-500 hover:text-red-500 cursor-pointer hover:rotate-90 transition-transform duration-300"
                size={15}
                strokeWidth={3}
              />
            </div>
          )}
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
