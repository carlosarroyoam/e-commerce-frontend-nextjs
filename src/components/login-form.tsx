"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { RefreshCcwIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useAuth } from "@/hooks/use-auth";
import axios from "@/lib/axios";
import { getDevicefingerprint } from "@/lib/device-fingerprint";
import { loginFormSchema, LoginFormSchemaType } from "@/lib/zod";
import { LoginResponse } from "@/types/login-response";
import { User } from "@/types/user";

const loginFn = async (values: LoginFormSchemaType) => {
  const deviceFingerprint = getDevicefingerprint();

  const {
    data: { user },
  } = await axios.post<LoginResponse>("/auth/login", {
    email: values.email,
    password: values.password,
    device_fingerprint: deviceFingerprint,
  });

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_role: user.user_role,
    user_role_id: user.user_role_id,
  } as User;
};

const LoginForm = () => {
  const router = useRouter();
  const { saveSession } = useAuth();

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: logIn, isPending } = useMutation({
    mutationFn: (values: LoginFormSchemaType) => loginFn(values),
    onSuccess: (user) => {
      saveSession(user);
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.status === 422) {
          if (err.response?.data.details["email"]) {
            form.setError("email", {
              message: err.response?.data.details["email"],
            });
          }

          if (err.response?.data.details["password"]) {
            form.setError("password", {
              message: err.response?.data.details["password"],
            });
          }
        } else {
          if (err.response?.data.message) {
            form.setError("root", {
              message: err.response?.data.message,
            });
          }
        }
      }
    },
  });

  const onSubmit = (values: LoginFormSchemaType) => logIn(values);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Log in
            {isPending && (
              <RefreshCcwIcon className="ml-4 size-4 animate-spin" />
            )}
          </Button>
        </form>
      </Form>

      {form.formState.errors.root ? (
        <Alert variant="destructive" className="mt-8">
          <TriangleAlertIcon className="size-4" />
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  );
};

export default LoginForm;
