"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimeIntervalInput from "@/components/time-interval-input";
import { Spinner } from "@/components/ui/spinner";
import useScheduleForm from "@/hooks/use-schedule-form";

const dayNames = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function CreateScheduleForm({
  scheduleId,
}: {
  scheduleId?: number;
}) {
  const {
    form,
    partida,
    isPending,
    isGetSchedulePending,
    onSubmit,
    onCheckedChange,
  } = useScheduleForm(scheduleId);

  return isGetSchedulePending ? (
    <Spinner />
  ) : (
    <Form {...form}>
      {form.formState.errors.days?.root?.message && (
        <FormMessage>{form.formState.errors.days.root.message}</FormMessage>
      )}
      <div className="mb-2 flex items-center gap-2">
        <Switch id="partida" onCheckedChange={onCheckedChange} />
        <Label htmlFor="partida">Jornada Partida</Label>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {Array.from(Array(7).keys()).map((day) => {
          return (
            <div key={day} className="grid">
              <FormLabel>{dayNames[day]}</FormLabel>
              {partida && form.formState.errors.days?.[day]?.message}
              <div className="flex gap-4">
                <TimeIntervalInput day={day} partida={partida} />
                {partida && (
                  <>
                    <div className="flex gap-4">
                      <TimeIntervalInput
                        day={day}
                        partida={partida}
                        shift={1}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        <Button
          type="submit"
          className="mt-8"
          disabled={isPending}
          onClick={() => console.log(form.getValues())}
        >
          {isPending ? (
            <>
              <Spinner className="text-white" /> Submitting...
            </>
          ) : scheduleId ? (
            "Update Schedule"
          ) : (
            "Create Schedule"
          )}
        </Button>
      </form>
    </Form>
  );
}
