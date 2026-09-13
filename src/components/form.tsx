"use client";

import { Form as FormPrimitive } from "@base-ui/react/form";
import { cn } from "cn";
import type * as React from "react";

function Form({ className, ...props }: FormPrimitive.Props): React.JSX.Element {
  return (
    <FormPrimitive
      className={cn("flex w-full flex-col gap-4", className)}
      data-slot="form"
      {...props}
    />
  );
}

export { Form };
