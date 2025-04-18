import Select, { MultiValue } from 'react-select';

interface OptionType {
  value: string;
  label: string;
}

type Props = {
  options: OptionType[];
  value: MultiValue<OptionType>;
  change: (value: MultiValue<OptionType>) => void;
  placeHolder: string;
};

export default function SelecteComponent({options, value, change, placeHolder}: Props) {
  return (
    <>
      <Select 
        options={options} 
        value={value}
        onChange={change}
        components={{ ClearIndicator: () => null }}
        className="w-full"
        isMulti
        placeholder={placeHolder}
        styles={{
          multiValueLabel: () => ({
            display: "none"
          }),
          multiValueRemove: () => ({
            display: "none"
          })
        }}
      />
    </>
  )
}
