import React, { useEffect, useRef, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatNameAsInitials } from "@/utils/formatting";

type SelectOption<T> = {
  id: string | number;
  value: T;
  label: string;
  url?: string;
};
type SelectWithImagesProps<T> = {
  width?: string;
  label: string;
  labelClassName?: string;
  showLabel?: boolean;
  value: any | null;
  editable?: boolean;
  selectedItemLabel: string;
  options: SelectOption<T>[] | null;
  handleChange: (value: T) => void;
  onReset: () => void;
};

function SelectWithImages<T>({
  width,
  label,
  labelClassName = "text-sm tracking-tight text-primary/80 font-medium text-start",
  showLabel = true,
  value,
  editable = true,
  options,
  selectedItemLabel,
  handleChange,
  onReset,
}: SelectWithImagesProps<T>) {
  function getValueID(value: T | null) {
    if (options && value) {
      // console.log("OPTIONS", options);
      // console.log("VALUE", value);
      const filteredOption = options?.find((option) => option.value === value || option.id === value);
      if (filteredOption) return filteredOption.id;
      else return null;
    } else return null;
  }

  const ref = useRef<any>(null);
  const [items, setItems] = useState<SelectOption<T>[] | null>(options);
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | string | null>(getValueID(value));

  const [searchFilter, setSearchFilter] = useState<string>("");
  const inputIdentifier = label.toLowerCase().replace(" ", "_");
  function handleSelect(id: string | number, item: T) {
    handleChange(item);
    setSelectedId(id);
    setSelectMenuIsOpen(false);
  }
  function handleFilter(value: string) {
    setSearchFilter(value);
    if (!items || !options) return;
    if (value.trim().length > 0) {
      let filteredItems = options.filter((item) => item.label.toUpperCase().includes(value.toUpperCase()));
      setItems(filteredItems);
      return;
    } else {
      setItems(options);
      return;
    }
  }
  function resetState() {
    onReset();
    setSelectedId(null);
    setSelectMenuIsOpen(false);
  }
  function onClickOutside() {
    setSearchFilter("");
    setSelectMenuIsOpen(false);
  }
  useEffect(() => {
    setSelectedId(getValueID(value));
    setItems(options);
  }, [options, value]);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    document.addEventListener("click", (e) => handleClickOutside(e), true);
    return () => {
      document.removeEventListener("click", (e) => handleClickOutside(e), true);
    };
  }, [onClickOutside]);
  return (
    <div ref={ref} className={`relative flex w-full flex-col gap-1 lg:w-[${width ? width : "350px"}]`}>
      {showLabel ? (
        <label htmlFor={inputIdentifier} className={labelClassName}>
          {label}
        </label>
      ) : null}
      <div
        className={`flex h-full min-h-[46.6px] w-full items-center justify-between rounded-md border duration-500 ease-in-out ${
          selectMenuIsOpen ? "border-gray-500" : "border-gray-200"
        } bg-[#fff] p-3 text-sm shadow-sm`}
      >
        {selectMenuIsOpen ? (
          <input
            type="text"
            autoFocus
            value={searchFilter}
            onChange={(e) => handleFilter(e.target.value)}
            placeholder="Filtre o item desejado..."
            className="h-full w-full text-sm italic outline-none"
          />
        ) : (
          <div className="flex grow items-center gap-2">
            {selectedId && options ? (
              <>
                <Avatar className="h-[20px] w-[20px]">
                  <AvatarImage src={options.find((item) => item.id == selectedId)?.url} alt={"Avatar"} />
                  <AvatarFallback>{formatNameAsInitials(options.find((item) => item.id == selectedId)?.label || "")}</AvatarFallback>
                </Avatar>

                <p
                  onClick={() => {
                    if (editable) setSelectMenuIsOpen((prev) => !prev);
                  }}
                  className="grow cursor-pointer text-[#353432]"
                >
                  {selectedId && options ? options.filter((item) => item.id == selectedId)[0]?.label : "NÃO DEFINIDO"}
                </p>
              </>
            ) : (
              <p
                onClick={() => {
                  if (editable) setSelectMenuIsOpen((prev) => !prev);
                }}
                className="grow cursor-pointer text-[#353432]"
              >
                NÃO DEFINIDO
              </p>
            )}
          </div>
        )}
        {selectMenuIsOpen ? (
          <IoMdArrowDropup
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen((prev) => !prev);
            }}
          />
        ) : (
          <IoMdArrowDropdown
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (editable) setSelectMenuIsOpen((prev) => !prev);
            }}
          />
        )}
      </div>
      {selectMenuIsOpen ? (
        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 absolute top-[75px] z-[100] flex h-[250px] max-h-[250px] w-full flex-col self-center overflow-y-auto overscroll-y-auto rounded-md border border-gray-200 bg-[#fff] p-2 py-1 shadow-sm">
          <div onClick={() => resetState()} className={`flex w-full cursor-pointer items-center rounded p-1 px-2 hover:bg-gray-100 ${!selectedId ? "bg-gray-100" : ""}`}>
            <p className="grow font-medium text-[#353432]">{selectedItemLabel}</p>
            {!selectedId ? <HiCheck style={{ color: "#fead61", fontSize: "20px" }} /> : null}
          </div>
          <div className="my-2 h-[1px] w-full bg-gray-200"></div>
          {items ? (
            items.map((item, index) => (
              <div
                onClick={() => handleSelect(item.id, item.value)}
                key={item.id ? item.id : index}
                className={`flex w-full cursor-pointer items-center rounded p-2 px-2 hover:bg-gray-100 ${selectedId == item.id ? "bg-gray-100" : ""}`}
              >
                <Avatar className="h-[20px] w-[20px]">
                  <AvatarImage src={item.url} alt={"Avatar"} />
                  <AvatarFallback>{formatNameAsInitials(item.label)}</AvatarFallback>
                </Avatar>
                <p className="grow pl-2 text-sm font-medium text-[#353432]">{item.label}</p>
                {selectedId == item.id ? <HiCheck style={{ color: "#fead61", fontSize: "20px" }} /> : null}
              </div>
            ))
          ) : (
            <p className="w-full text-center text-sm italic text-[#353432]">Sem opções disponíveis.</p>
          )}
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default SelectWithImages;
