import { DateTimePicker } from "@/components/date-time-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useDialog } from "@/hooks/use-dialog";
import { updateClocking } from "@/server/actions/clockings";
import { clockingSchema } from "@/zod-schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    clockIn: z.date(),
    clockOut: z.date().nullable(),
  })
  .refine((data) => !data.clockOut || data.clockOut > data.clockIn, {
    message: "Clock out must be greater than clock in",
    path: ["clockOut"],
  });

export default function EditClockingForm({
  clocking,
}: {
  clocking: z.infer<typeof clockingSchema>;
}) {
  const { toggleModal } = useDialog();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clockIn: clocking.clockIn,
      clockOut: clocking.clockOut,
    },
  });

  const { executeAsync, isPending } = useAction(updateClocking);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await executeAsync({
      id: clocking.id,
      clockIn: data.clockIn,
      clockOut: data.clockOut,
    });
    if (res?.serverError) {
      toast.error(res.serverError);
    }
    if (res?.data?.message) {
      toast.success(res.data.message);
      toggleModal();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="clockIn"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Clock In</FormLabel>
              <FormControl>
                <DateTimePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clockOut"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Clock Out</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value ?? new Date()}
                  setDate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-8" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner className="text-white" />
              Updating...
            </>
          ) : (
            "Update Clocking"
          )}
        </Button>
      </form>
    </Form>
  );
}
