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
  highlightedId: string | undefined;
  setHighlightedId: (id: string | undefined) => void;
}

const ListBoxContext = React.createContext<ListBoxContextValue | null>(null);

function useListBox() {
  const context = React.useContext(ListBoxContext);
  if (!context) {
    throw new Error("ListBox components must be used within a ListBox");
  }
  return context;
}

interface ListBoxProps extends Omit<
  useRender.ComponentProps<"div">,
  "defaultValue"
> {
  value?: ListBoxValue;
  defaultValue?: ListBoxValue;
  onValueChange?: (value: ListBoxValue) => void;
  multiple?: boolean;
  /** Submits the selection with a form: one hidden input per selected value. */
  name?: string;
}

const ENABLED_OPTIONS = "[role='option']:not([data-disabled='true'])";

// The list is one tab stop. Focus stays on it and the highlighted option is
// pointed to with aria-activedescendant, as in a native <select size>.
function ListBox({
  className,
  value,
  defaultValue,
  onValueChange,
  multiple,
  name,
  render,
  children,
  ...props
}: ListBoxProps): React.JSX.Element {
  const [internalValue, setInternalValue] = React.useState<
    ListBoxValue | undefined
  >(defaultValue ?? (multiple ? [] : undefined));
  const [highlightedId, setHighlightedId] = React.useState<string>();

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
    () => ({
      value: currentValue,
      onValueChange: handleValueChange,
      multiple,
      highlightedId,
      setHighlightedId,
    }),
    [currentValue, handleValueChange, multiple, highlightedId],
  );

  const internalRef = React.useRef<HTMLDivElement>(null);
  const typeaheadRef = React.useRef({ query: "", time: 0 });

  const getOptions = () =>
    Array.from(
      internalRef.current?.querySelectorAll<HTMLElement>(ENABLED_OPTIONS) ?? [],
    );

  const highlight = (option: HTMLElement | undefined) => {
    if (!option) return;
    setHighlightedId(option.id);
    option.scrollIntoView?.({ block: "nearest" });
  };

  // Entering the list highlights the (first) selected option, or the first.
  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const options = getOptions();
    if (highlightedId && options.some((o) => o.id === highlightedId)) return;
    highlight(
      options.find((o) => o.getAttribute("aria-selected") === "true") ??
        options[0],
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const options = getOptions();
    if (!options.length) return;
    const currentIndex = options.findIndex((o) => o.id === highlightedId);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlight(
          options[currentIndex < options.length - 1 ? currentIndex + 1 : 0],
        );
        return;
      case "ArrowUp":
        e.preventDefault();
        highlight(
          options[currentIndex > 0 ? currentIndex - 1 : options.length - 1],
        );
        return;
      case "Home":
        e.preventDefault();
        highlight(options[0]);
        return;
      case "End":
        e.preventDefault();
        highlight(options[options.length - 1]);
        return;
      case "Enter":
      case " ":
        if (currentIndex < 0) return;
        e.preventDefault();
        options[currentIndex].click();
        return;
      default:
        break;
    }

    // Typeahead: typed characters (within half a second of each other)
    // highlight the next option whose label starts with them.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = e.timeStamp;
      const state = typeaheadRef.current;
      state.query = (
        now - state.time > 500 ? e.key : state.query + e.key
      ).toLowerCase();
      state.time = now;
      const ordered = [
        ...options.slice(currentIndex + 1),
        ...options.slice(0, currentIndex + 1),
      ];
      const startsWith = (prefix: string) =>
        ordered.find((o) =>
          o.textContent?.trim().toLowerCase().startsWith(prefix),
        );
      // A repeated single letter ("ccc") cycles through the options it
      // starts rather than looking for "ccc".
      const first = state.query[0];
      const match =
        startsWith(state.query) ??
        (state.query === first.repeat(state.query.length)
          ? startsWith(first)
          : undefined);
      if (match) {
        e.preventDefault();
        highlight(match);
      }
    }
  };

  const selectedValues =
    currentValue === undefined
      ? []
      : Array.isArray(currentValue)
        ? currentValue
        : [currentValue];

  const defaultProps = {
    className: cn(
      "flex flex-col gap-0.5 rounded-lg border bg-popover p-[calc(--spacing(1)-1px)] text-popover-foreground shadow-xs/5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      className,
    ),
    role: "listbox",
    "aria-multiselectable": multiple || undefined,
    "aria-activedescendant": highlightedId,
    "data-slot": "list-box",
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: () => setHighlightedId(undefined),
    tabIndex: 0,
    children: (
      <>
        {children}
        {name &&
          selectedValues.map((selected) => (
            <input key={selected} type="hidden" name={name} value={selected} />
          ))}
      </>
    ),
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
  id: idProp,
  render,
  ...props
}: ListBoxItemProps): React.ReactElement {
  const context = useListBox();
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  const isSelected = React.useMemo(() => {
    if (context.multiple && Array.isArray(context.value)) {
      return context.value.includes(value);
    }
    return context.value === value;
  }, [context.value, context.multiple, value]);

  const handleSelect = () => {
    if (disabled) return;
    context.setHighlightedId(id);
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
    id,
    className: cn(
      "relative flex min-h-8 cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-64 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground sm:min-h-7 sm:text-sm [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg]:pointer-events-none [&>svg]:shrink-0 gap-2 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
      className,
    ),
    role: "option",
    "aria-selected": isSelected,
    "aria-disabled": disabled || undefined,
    "data-selected": isSelected,
    "data-disabled": disabled,
    "data-highlighted": context.highlightedId === id ? "" : undefined,
    "data-slot": "list-box-item",
    onClick: () => {
      handleSelect();
    },
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
