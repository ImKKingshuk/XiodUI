"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import * as React from "react";

type ListBoxValue = string | string[];

interface ListBoxContextValue {
  value?: ListBoxValue;
  onValueChange?: (value: ListBoxValue) => void;
  multiple?: boolean;
}

const ListBoxContext = React.createContext<ListBoxContextValue | null>(null);

function useListBox() {
  const context = React.useContext(ListBoxContext);
  if (!context) {
    throw new Error("ListBox components must be used within a ListBox");
  }
  return context;
}

interface ListBoxProps extends useRender.ComponentProps<"div"> {
  value?: ListBoxValue;
  onValueChange?: (value: ListBoxValue) => void;
  multiple?: boolean;
}

function ListBox({
  className,
  value,
  onValueChange,
  multiple,
  render,
  ...props
}: ListBoxProps): React.JSX.Element {
  const [internalValue, setInternalValue] = React.useState<
    ListBoxValue | undefined
  >(multiple ? [] : undefined);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: ListBoxValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );
  const contextValue = React.useMemo(
    () => ({ value: currentValue, onValueChange: handleValueChange, multiple }),
    [currentValue, handleValueChange, multiple],
  );

  const internalRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!internalRef.current) return;
    const items = Array.from(
      internalRef.current.querySelectorAll(
        "[role='option']:not([data-disabled='true'])",
      ),
    ) as HTMLElement[];

    if (!items.length) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[nextIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  const defaultProps = {
    className: cn(
      "flex flex-col gap-0.5 rounded-lg border bg-popover p-[calc(--spacing(1)-1px)] text-popover-foreground shadow-xs/5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      className,
    ),
    role: "listbox",
    "aria-multiselectable": multiple,
    "data-slot": "list-box",
    onKeyDown: handleKeyDown,
    tabIndex: 0,
  };

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    ref: internalRef,
    render,
  });

  return (
    <ListBoxContext.Provider value={contextValue}>
      {element}
    </ListBoxContext.Provider>
  );
}

interface ListBoxItemProps extends useRender.ComponentProps<"div"> {
  value: string;
  disabled?: boolean;
}

function ListBoxItem({
  className,
  value,
  disabled,
  render,
  ...props
}: ListBoxItemProps): React.ReactElement {
  const context = useListBox();

  const isSelected = React.useMemo(() => {
    if (context.multiple && Array.isArray(context.value)) {
      return context.value.includes(value);
    }
    return context.value === value;
  }, [context.value, context.multiple, value]);

  const handleSelect = () => {
    if (disabled) return;
    if (context.multiple) {
      const current = Array.isArray(context.value) ? context.value : [];
      if (current.includes(value)) {
        context.onValueChange?.(current.filter((v) => v !== value));
      } else {
        context.onValueChange?.([...current, value]);
      }
    } else {
      context.onValueChange?.(value);
    }
  };

  const defaultProps = {
    className: cn(
      "relative flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-64 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground sm:min-h-7 sm:text-sm [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg]:pointer-events-none [&>svg]:shrink-0 gap-2 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
      className,
    ),
    role: "option",
    "aria-selected": isSelected,
    "data-selected": isSelected,
    "data-disabled": disabled,
    "data-slot": "list-box-item",
    onClick: (_e: React.MouseEvent) => {
      handleSelect();
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    },
    tabIndex: disabled ? -1 : -1,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function ListBoxGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("py-1", className),
    role: "group",
    "data-slot": "list-box-group",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function ListBoxLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "px-2 py-1.5 font-medium text-muted-foreground text-xs",
      className,
    ),
    "data-slot": "list-box-label",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function ListBoxSeparator({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("-mx-1 my-1 h-px bg-border", className),
    role: "separator",
    "data-slot": "list-box-separator",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export { ListBox, ListBoxGroup, ListBoxItem, ListBoxLabel, ListBoxSeparator };
