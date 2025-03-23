"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values);

    if (!res.success) {
      toast.error("Error!", {
        description: res?.message,
        className: "bg-red-600 text-white p-4 rounded-lg shadow-lg",
      });
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(newSession);

    toast.success("Success!", {
      description: res.message,
      className: "bg-green-600 text-white p-4 rounded-lg shadow-lg",
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    className="input-field"
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Name"
                    className="input-field"
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
