"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { signInAction } from "@/app/auth/v2/login/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Informe um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter ao menos 6 caracteres." }),
});

export function SuperadminLoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    const result = await signInAction(formData);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setErrorMessage(result.message ?? "Não foi possível realizar login.");
    setIsPending(false);
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
      {errorMessage ? (
        <Alert variant="destructive">
          <AlertTitle>Falha no login</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="voce@gennesi.com.br"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password">Senha</FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
      </FieldGroup>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        Entrar
      </Button>
    </form>
  );
}
