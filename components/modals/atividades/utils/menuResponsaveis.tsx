import SelectInput from "@/components/inputs/SelectInput";
import SelectWithImages from "@/components/inputs/SelectWithImages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TAtividade } from "@/schemas/atividadesSchema";
import { users } from "@/utils/constants";
import ReMct, { useState } from "react";
import { MdDelete } from "react-icons/md";

type MenuResponsaveisProps = {
  responsibles: TAtividade["responsaveis"];
  addResponsible: (responsible: TAtividade["responsaveis"][number]) => void;
  removeResponsible: (index: number) => void;
};
function MenuResponsaveis({
  responsibles,
  addResponsible,
  removeResponsible,
}: MenuResponsaveisProps) {
  const [responsibleHolder, setResponsibleHolder] = useState<
    TAtividade["responsaveis"][number]
  >({
    id: "",
    nome: "",
  });
  return (
    <div className="w-full flex flex-col gap-2">
      <SelectWithImages
        label="USUÁRIO"
        value={responsibleHolder.id}
        options={users.map((user) => ({
          id: user.id,
          label: user.nome,
          value: user.id,
          url: user.avatar_url,
        }))}
        handleChange={(value) => {
          const user = users.find((u) => u.id === value);
          if (!user) return;
          setResponsibleHolder((prev) => ({
            ...prev,
            id: user.id,
            nome: user.nome,
            avatar_url: user.avatar_url,
          }));
        }}
        onReset={() =>
          setResponsibleHolder({
            id: "",
            nome: "",
          })
        }
        selectedItemLabel="NÃO DEFINIDO"
      />
      <div className="w-full flex items-center justify-end">
        <Button onClick={() => addResponsible(responsibleHolder)} size={"sm"}>
          ADICIONAR RESPONSÁVEL
        </Button>
      </div>

      <div className="w-full flex items-center gap-2 justify-around flex-wrap">
        {responsibles.map((responsible, index) => (
          <div
            key={responsible.id}
            className="flex items-center gap-2  rounded border border-gray-300 p-3"
          >
            <Avatar className="w-5 h-5">
              <AvatarImage src={responsible.avatar_url || undefined} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-500">{responsible.nome}</p>{" "}
            <button
              className="text-sm text-red-500 hover:text-red-600 ease-in-out duration-300"
              onClick={() => removeResponsible(index)}
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MenuResponsaveis;
