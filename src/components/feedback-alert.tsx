import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FeedbackAlertProps = {
  status: string;
  message: string;
};

export function FeedbackAlert({ status, message }: FeedbackAlertProps) {
  const isError = status === "error";

  return (
    <Alert
      variant={isError ? "destructive" : "default"}
      className={
        !isError
          ? "border-emerald-200/70 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100 [&>svg]:text-emerald-700 dark:[&>svg]:text-emerald-400"
          : undefined
      }
    >
      {isError ? <AlertCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
      <AlertTitle>{isError ? "Não foi possível concluir a ação" : "Ação concluída"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
