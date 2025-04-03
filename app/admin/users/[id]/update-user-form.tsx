"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user.actions";
import { USER_ROLES } from "@/lib/constants";
import { updateUserSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateUserForm = ({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({ ...values, id: user.id });

      if (!res.success) {
        toast.error("Error!", {
          description: res?.message,
          className: "bg-red-600 text-white p-4 rounded-lg shadow-lg",
        });
      }

      toast.success("Success!", {
        description: res.message,
        className: "bg-green-600 text-white p-4 rounded-lg shadow-lg",
      });

      form.reset();
      router.push("/admin/users");
    } catch (error) {
      toast.error("Error!", {
        description: (error as Error).message,
        className: "bg-red-600 text-white p-4 rounded-lg shadow-lg",
      });
    }
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Èmail */}`
        <div className="">
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "email"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    placeholder="Enter user email"
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
        </div>
        {/* Name */}
        <div className="">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field}></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
        </div>
        {/* Role */}
        <div className="">
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "role"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role"></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className="flex-between mt-5">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
