"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { Cancel as X } from "xiod-icons/icons/Cancel";
import { Check } from "xiod-icons/icons/Check";
import { ChevronDown } from "xiod-icons/icons/ChevronDown";
import { Search } from "xiod-icons/icons/Search";

import { IconSlot } from "./icon-provider";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Popover, PopoverPopup, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";

// ============================================================================
// Country Dataset & Types
// ============================================================================

export interface CountryData {
  code: string; // ISO 3166-1 alpha-2 (e.g. "US", "GB", "IN")
  name: string;
  dialCode: string; // e.g. "+1", "+44", "+91"
  flag: string; // Emoji flag
  mask?: string; // e.g. "(###) ###-####"
}

export const COUNTRIES: CountryData[] = [
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    mask: "(###) ###-####",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    mask: "##### ######",
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    mask: "##### #####",
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    mask: "(###) ###-####",
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    mask: "#### ### ###",
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    mask: "#### ########",
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    flag: "🇫🇷",
    mask: "# ## ## ## ##",
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "+81",
    flag: "🇯🇵",
    mask: "## #### ####",
  },
  {
    code: "BR",
    name: "Brazil",
    dialCode: "+55",
    flag: "🇧🇷",
    mask: "(##) #####-####",
  },
  {
    code: "CN",
    name: "China",
    dialCode: "+86",
    flag: "🇨🇳",
    mask: "### #### ####",
  },
  {
    code: "ES",
    name: "Spain",
    dialCode: "+34",
    flag: "🇪🇸",
    mask: "### ## ## ##",
  },
  {
    code: "IT",
    name: "Italy",
    dialCode: "+39",
    flag: "🇮🇹",
    mask: "### #######",
  },
  {
    code: "MX",
    name: "Mexico",
    dialCode: "+52",
    flag: "🇲🇽",
    mask: "### ### ####",
  },
  {
    code: "NL",
    name: "Netherlands",
    dialCode: "+31",
    flag: "🇳🇱",
    mask: "# ########",
  },
  {
    code: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    mask: "#### ####",
  },
  {
    code: "KR",
    name: "South Korea",
    dialCode: "+82",
    flag: "🇰🇷",
    mask: "## #### ####",
  },
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "+27",
    flag: "🇿🇦",
    mask: "## ### ####",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    dialCode: "+971",
    flag: "🇦🇪",
    mask: "## ### ####",
  },
  {
    code: "AR",
    name: "Argentina",
    dialCode: "+54",
    flag: "🇦🇷",
    mask: "### ###-####",
  },
  {
    code: "CH",
    name: "Switzerland",
    dialCode: "+41",
    flag: "🇨🇭",
    mask: "## ### ## ##",
  },
  {
    code: "SE",
    name: "Sweden",
    dialCode: "+46",
    flag: "🇸🇪",
    mask: "##-### ## ##",
  },
  {
    code: "NO",
    name: "Norway",
    dialCode: "+47",
    flag: "🇳🇴",
    mask: "### ## ###",
  },
  {
    code: "DK",
    name: "Denmark",
    dialCode: "+45",
    flag: "🇩🇰",
    mask: "## ## ## ##",
  },
  {
    code: "FI",
    name: "Finland",
    dialCode: "+358",
    flag: "🇫🇮",
    mask: "## ### ## ##",
  },
  {
    code: "NZ",
    name: "New Zealand",
    dialCode: "+64",
    flag: "🇳🇿",
    mask: "## ### ####",
  },
  {
    code: "PL",
    name: "Poland",
    dialCode: "+48",
    flag: "🇵🇱",
    mask: "### ### ###",
  },
  {
    code: "PT",
    name: "Portugal",
    dialCode: "+351",
    flag: "🇵🇹",
    mask: "### ### ###",
  },
  {
    code: "IE",
    name: "Ireland",
    dialCode: "+353",
    flag: "🇮🇪",
    mask: "## ### ####",
  },
  {
    code: "BE",
    name: "Belgium",
    dialCode: "+32",
    flag: "🇧🇪",
    mask: "### ## ## ##",
  },
  {
    code: "AT",
    name: "Austria",
    dialCode: "+43",
    flag: "🇦🇹",
    mask: "#### ######",
  },
  {
    code: "IL",
    name: "Israel",
    dialCode: "+972",
    flag: "🇮🇱",
    mask: "##-###-####",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    dialCode: "+966",
    flag: "🇸🇦",
    mask: "## ### ####",
  },
  {
    code: "TH",
    name: "Thailand",
    dialCode: "+66",
    flag: "🇹🇭",
    mask: "## #### ####",
  },
  {
    code: "MY",
    name: "Malaysia",
    dialCode: "+60",
    flag: "🇲🇾",
    mask: "##-### ####",
  },
  {
    code: "ID",
    name: "Indonesia",
    dialCode: "+62",
    flag: "🇮🇩",
    mask: "###-####-####",
  },
  {
    code: "PH",
    name: "Philippines",
    dialCode: "+63",
    flag: "🇵🇭",
    mask: "### ### ####",
  },
  {
    code: "VN",
    name: "Vietnam",
    dialCode: "+84",
    flag: "🇻🇳",
    mask: "### ### ####",
  },
  {
    code: "GR",
    name: "Greece",
    dialCode: "+30",
    flag: "🇬🇷",
    mask: "### #######",
  },
  {
    code: "TR",
    name: "Turkey",
    dialCode: "+90",
    flag: "🇹🇷",
    mask: "### ### ## ##",
  },
  {
    code: "UA",
    name: "Ukraine",
    dialCode: "+380",
    flag: "🇺🇦",
    mask: "## ### ## ##",
  },
  {
    code: "CZ",
    name: "Czech Republic",
    dialCode: "+420",
    flag: "🇨🇿",
    mask: "### ### ###",
  },
  {
    code: "HU",
    name: "Hungary",
    dialCode: "+36",
    flag: "🇭🇺",
    mask: "## ### ####",
  },
  {
    code: "RO",
    name: "Romania",
    dialCode: "+40",
    flag: "🇷🇴",
    mask: "### ### ###",
  },
  {
    code: "CL",
    name: "Chile",
    dialCode: "+56",
    flag: "🇨🇱",
    mask: "# #### ####",
  },
  {
    code: "CO",
    name: "Colombia",
    dialCode: "+57",
    flag: "🇨🇴",
    mask: "### ### ####",
  },
  {
    code: "PE",
    name: "Peru",
    dialCode: "+51",
    flag: "🇵🇪",
    mask: "### ### ###",
  },
  {
    code: "EG",
    name: "Egypt",
    dialCode: "+20",
    flag: "🇪🇬",
    mask: "## #### ####",
  },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "🇳🇬",
    mask: "### ### ####",
  },
  {
    code: "KE",
    name: "Kenya",
    dialCode: "+254",
    flag: "🇰🇪",
    mask: "### ######",
  },
];

// Formatting helper
export function formatPhoneNumber(digits: string, mask?: string): string {
  const clean = digits.replace(/\D/g, "");
  if (!mask) return clean;

  let formatted = "";
  let digitIndex = 0;

  for (let i = 0; i < mask.length && digitIndex < clean.length; i++) {
    if (mask[i] === "#") {
      formatted += clean[digitIndex];
      digitIndex++;
    } else {
      formatted += mask[i];
    }
  }

  if (digitIndex < clean.length) {
    formatted += clean.slice(digitIndex);
  }

  return formatted;
}

// Extract dial code & national number from e164 formatted string
export function parseE164Number(
  e164: string,
  countries: CountryData[] = COUNTRIES,
): { country: CountryData; nationalNumber: string } | null {
  if (!e164.startsWith("+")) return null;

  const sortedCountries = countries.toSorted(
    (a, b) => b.dialCode.length - a.dialCode.length,
  );

  for (const country of sortedCountries) {
    if (e164.startsWith(country.dialCode)) {
      const rawNational = e164
        .slice(country.dialCode.length)
        .replace(/\D/g, "");
      return { country, nationalNumber: rawNational };
    }
  }

  return null;
}

// ============================================================================
// Variants & Context
// ============================================================================

export const inputPhoneVariants = cva(
  "w-full max-w-[15.5rem] sm:max-w-[15rem] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-muted/40 border-transparent focus-within:bg-background",
        ghost:
          "border-transparent bg-transparent shadow-none ring-0 focus-within:border-border",
      },
      size: {
        default: "max-w-[15.5rem] sm:max-w-[15rem]",
        sm: "max-w-[14.5rem] sm:max-w-[14rem]",
        lg: "max-w-[17rem] sm:max-w-[16.5rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface InputPhoneContextValue {
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedCountry: CountryData;
  setSelectedCountry: (country: CountryData) => void;
  nationalNumber: string;
  setNationalNumber: (num: string) => void;
  e164Value: string;
  disabled?: boolean;
  readOnly?: boolean;
  countries: CountryData[];
  onChange?: (
    e164: string,
    country: CountryData,
    nationalNumber: string,
  ) => void;
}

const InputPhoneContext = React.createContext<InputPhoneContextValue | null>(
  null,
);

export function useInputPhone(): InputPhoneContextValue {
  const context = React.useContext(InputPhoneContext);
  if (!context) {
    throw new Error(
      "useInputPhone must be used within an <InputPhone /> container.",
    );
  }
  return context;
}

// Backward compatibility hook alias
export const usePhoneInput = useInputPhone;

// ============================================================================
// InputPhone Root Component (Composes InputGroup)
// ============================================================================

export interface InputPhoneProps
  extends
    Omit<React.ComponentProps<typeof InputGroup>, "onChange">,
    VariantProps<typeof inputPhoneVariants> {
  defaultValue?: string; // e.164 string like "+15550000000"
  value?: string; // Controlled e.164 string
  defaultCountry?: string; // e.g. "US"
  countries?: CountryData[];
  disabled?: boolean;
  readOnly?: boolean;
  /** Submits the E.164 value (e.g. "+15550000000") with a form under this name. */
  name?: string;
  onChange?: (
    e164: string,
    country: CountryData,
    nationalNumber: string,
  ) => void;
}

export type PhoneInputProps = InputPhoneProps;

function InputPhone({
  className,
  variant,
  size,
  defaultValue = "",
  value: valueProp,
  defaultCountry = "US",
  countries = COUNTRIES,
  disabled,
  readOnly,
  name,
  onChange,
  children,
  ...props
}: InputPhoneProps): React.JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const initialCountry = React.useMemo(() => {
    if (defaultValue) {
      const parsed = parseE164Number(defaultValue, countries);
      if (parsed) return parsed.country;
    }
    return (
      countries.find(
        (c) => c.code.toUpperCase() === defaultCountry.toUpperCase(),
      ) || countries[0]
    );
  }, [defaultValue, defaultCountry, countries]);

  const initialNational = React.useMemo(() => {
    if (defaultValue) {
      const parsed = parseE164Number(defaultValue, countries);
      if (parsed) return parsed.nationalNumber;
    }
    return "";
  }, [defaultValue, countries]);

  const [selectedCountry, setSelectedCountryState] =
    React.useState<CountryData>(initialCountry);
  const [nationalNumber, setNationalNumberState] =
    React.useState<string>(initialNational);

  // Synchronize controlled value
  React.useEffect(() => {
    if (valueProp !== undefined) {
      const parsed = parseE164Number(valueProp, countries);
      if (parsed) {
        setSelectedCountryState(parsed.country);
        setNationalNumberState(parsed.nationalNumber);
      } else {
        setNationalNumberState(valueProp.replace(/\D/g, ""));
      }
    }
  }, [valueProp, countries]);

  const e164Value = React.useMemo(() => {
    const cleanDigits = nationalNumber.replace(/\D/g, "");
    if (!cleanDigits) return "";
    return `${selectedCountry.dialCode}${cleanDigits}`;
  }, [selectedCountry, nationalNumber]);

  const handleCountryChange = React.useCallback(
    (newCountry: CountryData) => {
      setSelectedCountryState(newCountry);
      const newE164 = nationalNumber.replace(/\D/g, "")
        ? `${newCountry.dialCode}${nationalNumber.replace(/\D/g, "")}`
        : "";
      onChange?.(newE164, newCountry, nationalNumber);
    },
    [nationalNumber, onChange],
  );

  const handleNationalNumberChange = React.useCallback(
    (newNational: string) => {
      // Check if pasted value starts with "+"
      if (newNational.trim().startsWith("+")) {
        const parsed = parseE164Number(newNational.trim(), countries);
        if (parsed) {
          setSelectedCountryState(parsed.country);
          setNationalNumberState(parsed.nationalNumber);
          const newE164 = `${parsed.country.dialCode}${parsed.nationalNumber}`;
          onChange?.(newE164, parsed.country, parsed.nationalNumber);
          return;
        }
      }

      const cleanDigits = newNational.replace(/\D/g, "");
      setNationalNumberState(cleanDigits);
      const newE164 = cleanDigits
        ? `${selectedCountry.dialCode}${cleanDigits}`
        : "";
      onChange?.(newE164, selectedCountry, cleanDigits);
    },
    [selectedCountry, countries, onChange],
  );

  const contextValue = React.useMemo(
    () => ({
      containerRef,
      selectedCountry,
      setSelectedCountry: handleCountryChange,
      nationalNumber,
      setNationalNumber: handleNationalNumberChange,
      e164Value,
      disabled,
      readOnly,
      countries,
      onChange,
    }),
    [
      selectedCountry,
      handleCountryChange,
      nationalNumber,
      handleNationalNumberChange,
      e164Value,
      disabled,
      readOnly,
      countries,
      onChange,
    ],
  );

  return (
    <InputGroup
      ref={containerRef}
      className={cn(inputPhoneVariants({ variant, size }), className)}
      data-slot="input-phone"
      {...props}
    >
      <InputPhoneContext.Provider value={contextValue}>
        {children || (
          <>
            <InputPhoneCountrySelect />
            <InputPhoneInput />
          </>
        )}
      </InputPhoneContext.Provider>
      {name && (
        <input
          type="hidden"
          name={name}
          value={e164Value}
          disabled={disabled}
          data-slot="input-phone-value"
        />
      )}
    </InputGroup>
  );
}

// ============================================================================
// InputPhoneCountrySelect Component (Composes InputGroupAddon, Popover, & ScrollArea)
// ============================================================================

export interface InputPhoneCountrySelectProps extends useRender.ComponentProps<"button"> {}

export type PhoneInputCountrySelectProps = InputPhoneCountrySelectProps;

function InputPhoneCountrySelect({
  className,
  render,
  triggerIcon,
  searchIcon,
  clearIcon,
  selectedIcon,
  ...props
}: InputPhoneCountrySelectProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  triggerIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  searchIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  clearIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  selectedIcon?: React.ReactNode;
}): React.JSX.Element {
  const {
    containerRef,
    selectedCountry,
    setSelectedCountry,
    disabled,
    readOnly,
    countries,
  } = useInputPhone();

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlightedCode, setHighlightedCode] = React.useState<string | null>(
    null,
  );
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const idPrefix = React.useId();
  const listId = `${idPrefix}-countries`;
  const optionId = (code: string) => `${idPrefix}-country-${code}`;

  const filteredCountries = React.useMemo(() => {
    if (!search.trim()) return countries;
    const query = search.toLowerCase().trim();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.dialCode.includes(query),
    );
  }, [search, countries]);

  // Keep the highlight on a visible option: the selected country when the
  // list opens, the first match while searching.
  const activeCode = filteredCountries.some((c) => c.code === highlightedCode)
    ? highlightedCode
    : (filteredCountries[0]?.code ?? null);

  const highlight = (code: string | null) => {
    setHighlightedCode(code);
    if (!code) return;
    const option = listRef.current?.querySelector(
      `[data-code="${CSS.escape(code)}"]`,
    );
    option?.scrollIntoView?.({ block: "nearest" });
  };

  const selectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setOpen(false);
    setSearch("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredCountries.length) return;
    const index = filteredCountries.findIndex((c) => c.code === activeCode);
    const last = filteredCountries.length - 1;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowDown":
        next = index < last ? index + 1 : 0;
        break;
      case "ArrowUp":
        next = index > 0 ? index - 1 : last;
        break;
      case "PageDown":
        next = Math.min(index + 8, last);
        break;
      case "PageUp":
        next = Math.max(index - 8, 0);
        break;
      case "Enter": {
        const country = filteredCountries[index];
        if (country) {
          e.preventDefault();
          selectCountry(country);
        }
        return;
      }
      default:
        return;
    }
    e.preventDefault();
    highlight(filteredCountries[next]?.code ?? null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setHighlightedCode(selectedCountry.code);
    else setSearch("");
  };

  // Bring the selected country into view when the list opens.
  React.useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      listRef.current
        ?.querySelector("[aria-selected=true]")
        ?.scrollIntoView?.({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const defaultTriggerProps = {
    type: "button" as const,
    disabled: disabled || readOnly,
    "aria-label": `Select country, current ${selectedCountry.name} (${selectedCountry.dialCode})`,
    className: cn(
      "inline-flex items-center gap-1.5 pe-2.5 ps-1 py-1 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors select-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-64 pointer-coarse:after:absolute pointer-coarse:after:min-h-11 shrink-0 border-r border-input/40",
      className,
    ),
    "data-slot": "input-phone-country",
    children: (
      <>
        <span
          className="text-base leading-none select-none"
          data-slot="input-phone-flag"
        >
          {selectedCountry.flag}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          {selectedCountry.dialCode}
        </span>
        <IconSlot
          name="ChevronDown"
          icon={triggerIcon}
          fallback={ChevronDown}
          className="size-3.5 opacity-60 shrink-0"
        />
      </>
    ),
  };

  return (
    <InputGroupAddon align="inline-start" className="pe-0">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={useRender({
            defaultTagName: "button",
            props: mergeProps<"button">(defaultTriggerProps, props),
            render,
          })}
        />
        <PopoverPopup
          anchor={containerRef}
          align="start"
          side="bottom"
          sideOffset={4}
          hideArrow
          initialFocus={searchRef}
          collisionAvoidance={{ fallbackAxisSide: "none" }}
          className="w-(--anchor-width) **:data-[slot=popover-viewport]:p-2 **:data-[slot=popover-viewport]:[--viewport-inline-padding:--spacing(2)] z-50"
          data-slot="input-phone-country-content"
        >
          {/* Compact Search Header */}
          <div className="relative mb-1 flex items-center gap-1.5 px-2 py-1 border-b border-border/40 pb-1.5">
            <IconSlot
              name="Search"
              icon={searchIcon}
              fallback={Search}
              className="size-3.5 text-muted-foreground shrink-0"
            />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-label="Search countries"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeCode ? optionId(activeCode) : undefined
              }
              autoComplete="off"
              spellCheck={false}
              placeholder="Search country or code..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setHighlightedCode(null);
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none border-0 p-0"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear country search"
                onClick={() => {
                  setSearch("");
                  searchRef.current?.focus();
                }}
                className="p-0.5 rounded text-muted-foreground hover:text-foreground"
              >
                <IconSlot
                  name="Cancel"
                  icon={clearIcon}
                  fallback={X}
                  className="size-3"
                />
              </button>
            )}
          </div>

          {/* Scrollable Country List */}
          <ScrollArea className="max-h-[min(11rem,calc(var(--available-height,11rem)-3.5rem))] flex flex-col gap-0.5 text-xs">
            {filteredCountries.length === 0 ? (
              <div
                role="status"
                className="p-2 text-center text-muted-foreground text-xs"
              >
                No country found
              </div>
            ) : null}
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label="Countries"
              className="flex flex-col gap-0.5"
            >
              {filteredCountries.map((c, index) => {
                const isSelected = c.code === selectedCountry.code;
                const isHighlighted = c.code === activeCode;
                return (
                  <div
                    key={`${c.code}-${index}`}
                    id={optionId(c.code)}
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    data-code={c.code}
                    data-highlighted={isHighlighted || undefined}
                    // Keep focus in the search field while clicking.
                    onMouseDown={(e) => e.preventDefault()}
                    onPointerMove={() => {
                      if (!isHighlighted) setHighlightedCode(c.code);
                    }}
                    onClick={() => selectCountry(c)}
                    className={cn(
                      "flex w-full cursor-default items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-foreground transition-colors data-highlighted:bg-muted/60",
                      isSelected &&
                        "bg-accent text-accent-foreground font-medium data-highlighted:bg-accent",
                    )}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs leading-none">{c.flag}</span>
                      <span className="truncate text-xs">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] text-muted-foreground">
                      <span>{c.dialCode}</span>
                      {isSelected && (
                        <IconSlot
                          name="Check"
                          icon={selectedIcon}
                          fallback={Check}
                          className="size-3.5 text-primary"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverPopup>
      </Popover>
    </InputGroupAddon>
  );
}

// ============================================================================
// InputPhoneInput Component (Composes InputGroupInput & InputGroupAddon)
// ============================================================================

export interface InputPhoneInputProps extends Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "onChange" | "value"
> {
  className?: string;
}

export type PhoneInputInputProps = InputPhoneInputProps;

function InputPhoneInput({
  className,
  clearIcon,
  ...props
}: InputPhoneInputProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  clearIcon?: React.ReactNode;
}): React.JSX.Element {
  const {
    selectedCountry,
    nationalNumber,
    setNationalNumber,
    disabled,
    readOnly,
  } = useInputPhone();

  const formattedDisplay = React.useMemo(() => {
    return formatPhoneNumber(nationalNumber, selectedCountry.mask);
  }, [nationalNumber, selectedCountry.mask]);

  // Where the caret should land after the next render, counted in digits,
  // since the mask adds and removes separators around it.
  const caretRef = React.useRef<{
    input: HTMLInputElement;
    digits: number;
  } | null>(null);

  React.useLayoutEffect(() => {
    const pending = caretRef.current;
    caretRef.current = null;
    if (!pending || pending.input !== document.activeElement) return;
    const value = pending.input.value;
    let position = 0;
    let seen = 0;
    while (position < value.length && seen < pending.digits) {
      if (/\d/.test(value[position])) seen++;
      position++;
    }
    pending.input.setSelectionRange(position, position);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    if (value.trim().startsWith("+")) {
      setNationalNumber(value);
      return;
    }
    const caret = input.selectionStart ?? value.length;
    let digits = value.replace(/\D/g, "");
    let digitsBeforeCaret = value.slice(0, caret).replace(/\D/g, "").length;
    // Deleting a separator changes no digit, so the mask would put it straight
    // back: delete the digit before it instead.
    if (
      digits === nationalNumber &&
      value.length < formattedDisplay.length &&
      digitsBeforeCaret > 0
    ) {
      digits =
        digits.slice(0, digitsBeforeCaret - 1) +
        digits.slice(digitsBeforeCaret);
      digitsBeforeCaret--;
    }
    caretRef.current = { input, digits: digitsBeforeCaret };
    setNationalNumber(digits);
  };

  return (
    <>
      <InputGroupInput
        type="tel"
        value={formattedDisplay}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={selectedCountry.mask || "Phone number"}
        aria-label="Phone number"
        autoComplete="tel-national"
        inputMode="tel"
        className={cn(
          "w-full bg-transparent px-[calc(--spacing(3)-1px)] py-1.5 text-foreground placeholder:text-muted-foreground/60 font-mono border-0 shadow-none ring-0",
          className,
        )}
        data-slot="input-phone-number"
        {...props}
      />
      {nationalNumber && !disabled && !readOnly && (
        <InputGroupAddon align="inline-end">
          <button
            type="button"
            onClick={(e) => {
              setNationalNumber("");
              e.currentTarget
                .closest("[data-slot=input-phone]")
                ?.querySelector<HTMLInputElement>(
                  "[data-slot=input-phone-number]",
                )
                ?.focus();
            }}
            className="p-1 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted/40 transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-8"
            aria-label="Clear phone number"
          >
            <IconSlot
              name="Cancel"
              icon={clearIcon}
              fallback={X}
              className="size-3.5"
            />
          </button>
        </InputGroupAddon>
      )}
    </>
  );
}

// ============================================================================
// InputPhoneFlag Component
// ============================================================================

export interface InputPhoneFlagProps extends useRender.ComponentProps<"span"> {
  code?: string;
}

export type PhoneInputFlagProps = InputPhoneFlagProps;

function InputPhoneFlag({
  className,
  code,
  render,
  children,
  ...props
}: InputPhoneFlagProps): React.ReactElement {
  const context = React.useContext(InputPhoneContext);
  const targetCountry = code
    ? (context?.countries ?? COUNTRIES).find(
        (c) => c.code.toUpperCase() === code.toUpperCase(),
      )
    : context?.selectedCountry;

  const defaultProps = {
    className: cn(
      "inline-flex items-center justify-center text-base leading-none select-none",
      className,
    ),
    "data-slot": "input-phone-flag",
    children: children || targetCountry?.flag || "🌐",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

// Backward compatible aliases
const PhoneInput = InputPhone;
const PhoneInputCountrySelect = InputPhoneCountrySelect;
const PhoneInputFlag = InputPhoneFlag;
const PhoneInputInput = InputPhoneInput;
const phoneInputVariants = inputPhoneVariants;

export {
  InputPhone,
  InputPhoneCountrySelect,
  InputPhoneFlag,
  InputPhoneInput,
  PhoneInput,
  PhoneInputCountrySelect,
  PhoneInputFlag,
  PhoneInputInput,
  phoneInputVariants,
};
