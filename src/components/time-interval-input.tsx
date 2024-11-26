import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function TimeIntervalInput({
  day,
  partida,
  shift = 0,
}: {
  day: number;
  partida: boolean;
  shift?: number;
}) {
  const { control } = useFormContext();
  if (!control)
    throw new Error("TimeIntervalInput must be used within a form context");
  return (
    <>
      <FormField
        control={control}
        name={`days.${day}.${shift}.startTime`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-normal">
              Entrada {partida && "Mañana"}
            </FormLabel>
            <FormControl>
              <Input
                type="time"
                {...field}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number"
                    ? field.value
                    : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`days.${day}.${shift}.endTime`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salida {partida && "Mañana"}</FormLabel>
            <FormControl>
              <Input
                type="time"
                {...field}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number"
                    ? field.value
                    : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
