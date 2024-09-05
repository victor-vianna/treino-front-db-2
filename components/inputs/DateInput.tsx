import React from "react";
type TextInputProps = {
  width?: string;
  label: string;
  labelClassName?: string;
  showLabel?: boolean;
  value: string | undefined;
  editable?: boolean;
  handleChange: (value: string | undefined) => void;
};
function DateInput({
  width,
  label,
  labelClassName = "text-sm tracking-tight text-primary/80 font-medium",
  showLabel = true,
  value,
  editable = true,
  handleChange,
}: TextInputProps) {
  const inputIdentifier = label.toLowerCase().replace(" ", "_");
  return (
    <div className={`flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}
      <input
        readOnly={!editable}
        value={value}
        onChange={(e) => {
          handleChange(e.target.value != "" ? e.target.value : undefined);
        }}
        id={inputIdentifier}
        onReset={() => handleChange(undefined)}
        type="date"
        className="w-full rounded-md border border-gray-200 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-gray-500"
      />
    </div>
  );
}

export default DateInput;
