"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import * as React from "react";
import { CreditCard } from "xiod-icons/icons/CreditCard";
import { Zap } from "xiod-icons/icons/Zap";

import { Tabs, TabsList, TabsTab } from "./tabs";

// ============================================================================
// Major Global Payment Networks (Visa, Mastercard, Amex, RuPay, UnionPay, Discover, Diners Club, JCB, Mir)
// ============================================================================

export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "rupay"
  | "unionpay"
  | "discover"
  | "dinersclub"
  | "jcb"
  | "mir"
  | "unknown";

export interface CardCodeConfig {
  name: string;
  length: number;
}

export interface CardTypeConfig {
  displayName: string;
  type: CardBrand;
  startPattern: RegExp;
  gaps: number[];
  lengths: number[];
  code: CardCodeConfig;
}

export const CARD_TYPES: CardTypeConfig[] = [
  {
    displayName: "Visa",
    type: "visa",
    startPattern: /^4/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: { name: "CVV", length: 3 },
  },
  {
    displayName: "Mastercard",
    type: "mastercard",
    startPattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: "CVC", length: 3 },
  },
  {
    displayName: "American Express",
    type: "amex",
    startPattern: /^3[47]/,
    gaps: [4, 10],
    lengths: [15],
    code: { name: "CID", length: 4 },
  },
  {
    displayName: "RuPay",
    type: "rupay",
    startPattern:
      /^(508[5-9]|6069[89]|607[0-9]|608[0-3]|652[1-5]|652[89]|653[0-1]|6950|353|356)/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: "CVV", length: 3 },
  },
  {
    displayName: "UnionPay",
    type: "unionpay",
    startPattern: /^62/,
    gaps: [4, 8, 12],
    lengths: [14, 15, 16, 17, 18, 19],
    code: { name: "CVN", length: 3 },
  },
  {
    displayName: "Discover",
    type: "discover",
    startPattern: /^(6011|65|64[4-9]|622)/,
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: { name: "CID", length: 3 },
  },
  {
    displayName: "Diners Club",
    type: "dinersclub",
    startPattern: /^(36|38|30[0-5])/,
    gaps: [4, 10],
    lengths: [14, 16, 19],
    code: { name: "CVV", length: 3 },
  },
  {
    displayName: "JCB",
    type: "jcb",
    startPattern: /^35/,
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: { name: "CVV", length: 3 },
  },
  {
    displayName: "Mir",
    type: "mir",
    startPattern: /^220[0-4]/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: "CVC", length: 3 },
  },
];

export const DEFAULT_CARD_TYPE: CardTypeConfig = {
  displayName: "Unknown",
  type: "unknown",
  startPattern: /^/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: { name: "CVC", length: 3 },
};

export function getCardTypeByValue(cardNumber: string): CardTypeConfig {
  const clean = cardNumber.replace(/\D/g, "");
  if (!clean) return DEFAULT_CARD_TYPE;
  return (
    CARD_TYPES.find((cardType) => cardType.startPattern.test(clean)) ||
    DEFAULT_CARD_TYPE
  );
}

export function detectBrand(cardNumber: string): CardBrand {
  return getCardTypeByValue(cardNumber).type;
}

// ============================================================================
// UPI Payment Types & Provider Detection (Unified Payments Interface)
// ============================================================================

export type PaymentMethod = "card" | "upi";

export type UpiProvider =
  | "gpay"
  | "phonepe"
  | "paytm"
  | "amazonpay"
  | "bhim"
  | "cred"
  | "whatsapp"
  | "generic";

const UPI_HANDLE_MAP: Record<string, UpiProvider> = {
  // Google Pay
  okaxis: "gpay",
  okicici: "gpay",
  oksbi: "gpay",
  okhdfcbank: "gpay",

  // PhonePe
  ybl: "phonepe",
  ibl: "phonepe",
  axl: "phonepe",

  // Paytm
  paytm: "paytm",
  ptaxis: "paytm",
  ptyes: "paytm",
  ptsbi: "paytm",
  pthdfc: "paytm",

  // Amazon Pay
  apl: "amazonpay",
  yapl: "amazonpay",
  rapl: "amazonpay",

  // BHIM
  upi: "bhim",

  // CRED
  cred: "cred",
  axisb: "cred",
  yescred: "cred",
  yescurie: "cred",

  // WhatsApp Pay
  waicici: "whatsapp",
};

export function validateUpiId(vpa: string): boolean {
  const clean = vpa.trim();
  if (!clean) return false;
  // Standard VPA regex: username@handle (username: 2-256 chars, handle: 2-64 chars)
  const vpaRegex = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;
  return vpaRegex.test(clean);
}

export function detectUpiProvider(vpa: string): UpiProvider {
  const clean = vpa.trim().toLowerCase();
  if (!clean.includes("@")) return "generic";
  const handle = clean.split("@")[1];
  if (!handle) return "generic";
  return UPI_HANDLE_MAP[handle] || "generic";
}

export function getUpiError(vpa: string): string | undefined {
  const clean = vpa.trim();
  if (!clean) return "UPI ID is required";
  if (!clean.includes("@")) return "UPI ID must contain '@' (e.g. user@bank)";
  if (!validateUpiId(clean)) return "Invalid UPI ID format";
  return undefined;
}

// ============================================================================
// Validation & Formatter Utilities (Luhn, Expiry, CVC, Zip)
// ============================================================================

export function validateLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\D/g, "");
  if (!clean || clean.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(
  cardNumber: string,
  cardTypeConfig?: CardTypeConfig,
): string {
  const clean = cardNumber.replace(/\D/g, "");
  if (!clean) return "";
  const cardType = cardTypeConfig || getCardTypeByValue(clean);
  const maxLen = cardType.lengths[cardType.lengths.length - 1] || 19;
  const trimmed = clean.slice(0, maxLen);
  const gaps = cardType.gaps || [4, 8, 12];

  let formatted = "";
  for (let i = 0; i < trimmed.length; i++) {
    if (gaps.includes(i) && i > 0) {
      formatted += " ";
    }
    formatted += trimmed[i];
  }
  return formatted;
}

export function formatExpiry(value: string): string {
  const clean = value.replace(/\D/g, "");
  if (!clean) return "";

  if (clean.length === 1) {
    if (clean[0] !== "0" && clean[0] !== "1") {
      return `0${clean[0]}/`;
    }
    return clean;
  }

  const month = clean.slice(0, 2);
  const year = clean.slice(2, 4);

  let formattedMonth = month;
  const monthNum = parseInt(month, 10);
  if (monthNum > 12) {
    formattedMonth = "12";
  } else if (monthNum === 0 && clean.length >= 2) {
    formattedMonth = "01";
  }

  if (clean.length > 2) {
    return `${formattedMonth}/${year}`;
  }

  if (clean.length === 2) {
    return `${formattedMonth}/`;
  }

  return formattedMonth;
}

export interface PaymentInputErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  zip?: string;
  upi?: string;
}

export function getCardNumberError(cardNumber: string): string | undefined {
  const clean = cardNumber.replace(/\D/g, "");
  if (!clean) return "Card number is required";
  const cardType = getCardTypeByValue(clean);
  if (!cardType.lengths.includes(clean.length)) {
    return "Card number length is invalid";
  }
  if (!validateLuhn(clean)) {
    return "Card number checksum is invalid";
  }
  return undefined;
}

export function getExpiryDateError(expiryDate: string): string | undefined {
  const clean = expiryDate.replace(/\D/g, "");
  if (!clean) return "Expiry date is required";
  if (clean.length < 4) return "Expiry date must be MM/YY";

  const month = parseInt(clean.slice(0, 2), 10);
  const year = parseInt(`20${clean.slice(2, 4)}`, 10);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (month < 1 || month > 12) return "Expiry month must be 01–12";
  if (year < currentYear) return "Expiry year is in the past";
  if (year === currentYear && month < currentMonth)
    return "Expiry date is in the past";

  return undefined;
}

export function getCvcError(
  cvc: string,
  cardTypeConfig?: CardTypeConfig,
): string | undefined {
  const clean = cvc.replace(/\D/g, "");
  if (!clean) return "CVC is required";
  const expectedLength = cardTypeConfig?.code.length || 3;
  if (clean.length !== expectedLength) {
    return `CVC must be ${expectedLength} digits`;
  }
  return undefined;
}

export function getZipError(zip: string): string | undefined {
  const clean = zip.trim();
  if (!clean) return "ZIP code is required";
  if (clean.length < 3 || clean.length > 10) {
    return "ZIP code is invalid";
  }
  return undefined;
}

// ============================================================================
// Context & State Management
// ============================================================================

interface InputPaymentContextValue {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardZip: string;
  upiId: string;
  brand: CardBrand;
  cardType: CardTypeConfig;
  upiProvider: UpiProvider;
  disabled?: boolean;
  readOnly?: boolean;
  isInGroup: boolean;
  autoFocusNext: boolean;
  isLuhnValid: boolean;
  errors: PaymentInputErrors;
  isValid: boolean;
  cardNumberRef: React.RefObject<HTMLInputElement | null>;
  expiryRef: React.RefObject<HTMLInputElement | null>;
  cvcRef: React.RefObject<HTMLInputElement | null>;
  zipRef: React.RefObject<HTMLInputElement | null>;
  upiRef: React.RefObject<HTMLInputElement | null>;
  setCardNumber: (val: string) => void;
  setCardExpiry: (val: string) => void;
  setCardCvc: (val: string) => void;
  setCardZip: (val: string) => void;
  setUpiId: (val: string) => void;
}

const InputPaymentContext =
  React.createContext<InputPaymentContextValue | null>(null);

function useInputPaymentContext(): InputPaymentContextValue {
  const context = React.useContext(InputPaymentContext);
  if (!context) {
    throw new Error(
      "InputPayment subcomponents must be rendered within an <InputPayment> provider component.",
    );
  }
  return context;
}

export const usePaymentInputContext = useInputPaymentContext;
export const useInputPayment = useInputPaymentContext;
export const usePaymentInput = useInputPaymentContext;

export interface InputPaymentProps extends React.HTMLAttributes<HTMLDivElement> {
  paymentMethod?: PaymentMethod;
  defaultPaymentMethod?: PaymentMethod;
  onPaymentMethodChange?: (method: PaymentMethod) => void;

  cardNumber?: string;
  defaultCardNumber?: string;
  onCardNumberChange?: (val: string) => void;

  cardExpiry?: string;
  defaultCardExpiry?: string;
  onCardExpiryChange?: (val: string) => void;

  cardCvc?: string;
  defaultCardCvc?: string;
  onCardCvcChange?: (val: string) => void;

  cardZip?: string;
  defaultCardZip?: string;
  onCardZipChange?: (val: string) => void;

  upiId?: string;
  defaultUpiId?: string;
  onUpiIdChange?: (val: string) => void;

  disabled?: boolean;
  readOnly?: boolean;
  autoFocusNext?: boolean;
  onValidationChange?: (isValid: boolean, errors: PaymentInputErrors) => void;
  children?: React.ReactNode;
}

export type PaymentInputProps = InputPaymentProps;

function InputPayment({
  paymentMethod: paymentMethodProp,
  defaultPaymentMethod = "card",
  onPaymentMethodChange,
  cardNumber: cardNumberProp,
  defaultCardNumber = "",
  onCardNumberChange,
  cardExpiry: cardExpiryProp,
  defaultCardExpiry = "",
  onCardExpiryChange,
  cardCvc: cardCvcProp,
  defaultCardCvc = "",
  onCardCvcChange,
  cardZip: cardZipProp,
  defaultCardZip = "",
  onCardZipChange,
  upiId: upiIdProp,
  defaultUpiId = "",
  onUpiIdChange,
  disabled = false,
  readOnly = false,
  autoFocusNext = true,
  onValidationChange,
  children,
  ...props
}: InputPaymentProps): React.JSX.Element {
  const [internalPaymentMethod, setInternalPaymentMethod] =
    React.useState<PaymentMethod>(defaultPaymentMethod);
  const [internalCardNumber, setInternalCardNumber] =
    React.useState(defaultCardNumber);
  const [internalCardExpiry, setInternalCardExpiry] =
    React.useState(defaultCardExpiry);
  const [internalCardCvc, setInternalCardCvc] = React.useState(defaultCardCvc);
  const [internalCardZip, setInternalCardZip] = React.useState(defaultCardZip);
  const [internalUpiId, setInternalUpiId] = React.useState(defaultUpiId);
  const [isInGroup, setIsInGroup] = React.useState(false);

  const cardNumberRef = React.useRef<HTMLInputElement | null>(null);
  const expiryRef = React.useRef<HTMLInputElement | null>(null);
  const cvcRef = React.useRef<HTMLInputElement | null>(null);
  const zipRef = React.useRef<HTMLInputElement | null>(null);
  const upiRef = React.useRef<HTMLInputElement | null>(null);

  const paymentMethod = paymentMethodProp ?? internalPaymentMethod;
  const cardNumber = cardNumberProp ?? internalCardNumber;
  const cardExpiry = cardExpiryProp ?? internalCardExpiry;
  const cardCvc = cardCvcProp ?? internalCardCvc;
  const cardZip = cardZipProp ?? internalCardZip;
  const upiId = upiIdProp ?? internalUpiId;

  const cardType = React.useMemo(
    () => getCardTypeByValue(cardNumber),
    [cardNumber],
  );
  const brand = cardType.type;
  const upiProvider = React.useMemo(() => detectUpiProvider(upiId), [upiId]);
  const isLuhnValid = React.useMemo(
    () => validateLuhn(cardNumber),
    [cardNumber],
  );

  const setPaymentMethod = React.useCallback(
    (method: PaymentMethod) => {
      if (paymentMethodProp === undefined) {
        setInternalPaymentMethod(method);
      }
      onPaymentMethodChange?.(method);
    },
    [paymentMethodProp, onPaymentMethodChange],
  );

  const errors = React.useMemo<PaymentInputErrors>(() => {
    const errs: PaymentInputErrors = {};
    if (paymentMethod === "card") {
      if (cardNumber) errs.cardNumber = getCardNumberError(cardNumber);
      if (cardExpiry) errs.expiryDate = getExpiryDateError(cardExpiry);
      if (cardCvc) errs.cvc = getCvcError(cardCvc, cardType);
      if (cardZip) errs.zip = getZipError(cardZip);
    } else if (paymentMethod === "upi") {
      if (upiId) errs.upi = getUpiError(upiId);
    }
    return errs;
  }, [
    paymentMethod,
    cardNumber,
    cardExpiry,
    cardCvc,
    cardZip,
    upiId,
    cardType,
  ]);

  const isValid = React.useMemo(() => {
    if (paymentMethod === "card") {
      return (
        Boolean(cardNumber) &&
        Boolean(cardExpiry) &&
        Boolean(cardCvc) &&
        !errors.cardNumber &&
        !errors.expiryDate &&
        !errors.cvc &&
        !errors.zip
      );
    }
    if (paymentMethod === "upi") {
      return Boolean(upiId) && validateUpiId(upiId);
    }
    return false;
  }, [paymentMethod, cardNumber, cardExpiry, cardCvc, upiId, errors]);

  React.useEffect(() => {
    onValidationChange?.(isValid, errors);
  }, [isValid, errors, onValidationChange]);

  const setCardNumber = React.useCallback(
    (val: string) => {
      const clean = val.replace(/\D/g, "");
      const detected = getCardTypeByValue(clean);
      const formatted = formatCardNumber(clean, detected);

      if (cardNumberProp === undefined) {
        setInternalCardNumber(formatted);
      }
      onCardNumberChange?.(formatted);

      if (
        autoFocusNext &&
        detected.lengths.includes(clean.length) &&
        validateLuhn(clean)
      ) {
        expiryRef.current?.focus();
      }
    },
    [cardNumberProp, onCardNumberChange, autoFocusNext],
  );

  const setCardExpiry = React.useCallback(
    (val: string) => {
      const formatted = formatExpiry(val);
      if (cardExpiryProp === undefined) {
        setInternalCardExpiry(formatted);
      }
      onCardExpiryChange?.(formatted);

      const clean = formatted.replace(/\D/g, "");
      if (
        autoFocusNext &&
        clean.length === 4 &&
        !getExpiryDateError(formatted)
      ) {
        cvcRef.current?.focus();
      }
    },
    [cardExpiryProp, onCardExpiryChange, autoFocusNext],
  );

  const setCardCvc = React.useCallback(
    (val: string) => {
      const clean = val.replace(/\D/g, "");
      const limit = cardType.code.length;
      const truncated = clean.slice(0, limit);

      if (cardCvcProp === undefined) {
        setInternalCardCvc(truncated);
      }
      onCardCvcChange?.(truncated);

      if (autoFocusNext && truncated.length === limit && zipRef.current) {
        zipRef.current.focus();
      }
    },
    [cardCvcProp, onCardCvcChange, cardType, autoFocusNext],
  );

  const setCardZip = React.useCallback(
    (val: string) => {
      if (cardZipProp === undefined) {
        setInternalCardZip(val);
      }
      onCardZipChange?.(val);
    },
    [cardZipProp, onCardZipChange],
  );

  const setUpiId = React.useCallback(
    (val: string) => {
      if (upiIdProp === undefined) {
        setInternalUpiId(val);
      }
      onUpiIdChange?.(val);
    },
    [upiIdProp, onUpiIdChange],
  );

  const contextValue = React.useMemo(
    () => ({
      paymentMethod,
      setPaymentMethod,
      cardNumber,
      cardExpiry,
      cardCvc,
      cardZip,
      upiId,
      brand,
      cardType,
      upiProvider,
      disabled,
      readOnly,
      isInGroup,
      autoFocusNext,
      isLuhnValid,
      errors,
      isValid,
      cardNumberRef,
      expiryRef,
      cvcRef,
      zipRef,
      upiRef,
      setCardNumber,
      setCardExpiry,
      setCardCvc,
      setCardZip,
      setUpiId,
    }),
    [
      paymentMethod,
      setPaymentMethod,
      cardNumber,
      cardExpiry,
      cardCvc,
      cardZip,
      upiId,
      brand,
      cardType,
      upiProvider,
      disabled,
      readOnly,
      isInGroup,
      autoFocusNext,
      isLuhnValid,
      errors,
      isValid,
      setCardNumber,
      setCardExpiry,
      setCardCvc,
      setCardZip,
      setUpiId,
    ],
  );

  const providerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (
      providerRef.current?.querySelector(
        '[data-slot="input-payment-group"],[data-slot="input-payment-upi-group"]',
      )
    ) {
      setIsInGroup(true);
    }
  }, []);

  return (
    <InputPaymentContext.Provider value={contextValue}>
      <div ref={providerRef} className="contents" {...props}>
        {children}
      </div>
    </InputPaymentContext.Provider>
  );
}

// ============================================================================
// Compound Subcomponents
// ============================================================================

function InputPaymentMethodSelector({
  className,
  ...props
}: React.ComponentProps<typeof Tabs>): React.JSX.Element {
  const { disabled, paymentMethod, readOnly, setPaymentMethod } =
    useInputPaymentContext();

  return (
    <Tabs
      value={paymentMethod}
      onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
      className={cn("w-full", className)}
      data-slot="input-payment-method-selector"
      {...props}
    >
      <TabsList aria-label="Payment method" className="grid w-full grid-cols-2">
        <TabsTab
          disabled={disabled || readOnly}
          value="card"
          className="pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11"
        >
          <CreditCard className="size-4 shrink-0" />
          <span>Card</span>
        </TabsTab>
        <TabsTab
          disabled={disabled || readOnly}
          value="upi"
          className="pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11"
        >
          <Zap className="size-4 shrink-0 text-amber-500 fill-amber-500/20" />
          <span>UPI</span>
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}

function InputPaymentGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const { errors } = useInputPaymentContext();
  const hasError = Boolean(
    errors.cardNumber || errors.expiryDate || errors.cvc || errors.zip,
  );

  const defaultProps = {
    className: cn(
      "group/container relative inline-flex h-10 sm:h-9 w-full items-center gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-within:has-aria-invalid:border-destructive/64 has-focus-within:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-within:border-ring has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none has-focus-within:ring-[3px] px-[calc(--spacing(3)-1px)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    "aria-invalid": hasError ? true : undefined,
    "data-slot": "input-payment-group",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function InputPaymentUpiGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const { errors } = useInputPaymentContext();
  const hasError = Boolean(errors.upi);

  const defaultProps = {
    className: cn(
      "group/container relative inline-flex h-10 sm:h-9 w-full items-center gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-within:has-aria-invalid:border-destructive/64 has-focus-within:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-within:border-ring has-disabled:opacity-64 has-[:disabled,:focus-within,[aria-invalid]]:shadow-none has-focus-within:ring-[3px] px-[calc(--spacing(3)-1px)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-within:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    "aria-invalid": hasError ? true : undefined,
    "data-slot": "input-payment-upi-group",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

interface InputFieldProps extends Omit<
  React.ComponentProps<typeof InputPrimitive>,
  "size" | "className" | "style" | "onChange" | "onKeyDown"
> {
  size?: "sm" | "default" | "lg" | number;
  className?: string;
  style?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

function InputPaymentCardNumber({
  className,
  size = "default",
  onChange,
  ref,
  ...props
}: InputFieldProps): React.JSX.Element {
  const {
    cardNumber,
    setCardNumber,
    disabled,
    readOnly,
    isInGroup,
    cardNumberRef,
    errors,
  } = useInputPaymentContext();

  const handleRef = (node: HTMLInputElement | null) => {
    cardNumberRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
    onChange?.(e);
  };

  const field = (
    <InputPrimitive
      data-size={typeof size === "string" ? size : undefined}
      ref={handleRef}
      type="tel"
      inputMode="numeric"
      size={typeof size === "number" ? size : undefined}
      autoComplete="cc-number"
      value={cardNumber}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      placeholder="Card number"
      aria-label="Card number"
      aria-invalid={errors.cardNumber ? true : undefined}
      className={cn(
        "w-full bg-transparent font-mono outline-none caret-foreground placeholder:text-muted-foreground/60 text-foreground",
        isInGroup
          ? "border-0 p-0 shadow-none ring-0 focus-visible:ring-0"
          : "h-10 sm:h-9 rounded-lg border border-input px-3 text-sm shadow-xs/5 ring-ring/24 focus-visible:border-ring focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );

  return field;
}

function InputPaymentExpiry({
  className,
  size = "default",
  onChange,
  onKeyDown,
  ref,
  ...props
}: InputFieldProps): React.JSX.Element {
  const {
    cardExpiry,
    setCardExpiry,
    disabled,
    readOnly,
    isInGroup,
    expiryRef,
    cardNumberRef,
    autoFocusNext,
    errors,
  } = useInputPaymentContext();

  const handleRef = (node: HTMLInputElement | null) => {
    expiryRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === "Backspace" && !cardExpiry && autoFocusNext) {
      cardNumberRef.current?.focus();
    }
  };

  return (
    <InputPrimitive
      data-size={typeof size === "string" ? size : undefined}
      ref={handleRef}
      type="tel"
      inputMode="numeric"
      size={typeof size === "number" ? size : undefined}
      autoComplete="cc-exp"
      value={cardExpiry}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      readOnly={readOnly}
      placeholder="MM/YY"
      aria-label="Expiration date"
      aria-invalid={errors.expiryDate ? true : undefined}
      className={cn(
        "w-16 bg-transparent text-center font-mono outline-none caret-foreground placeholder:text-muted-foreground/60 text-foreground",
        isInGroup
          ? "border-0 p-0 shadow-none ring-0 focus-visible:ring-0"
          : "h-10 sm:h-9 rounded-lg border border-input px-2 text-sm shadow-xs/5 ring-ring/24 focus-visible:border-ring focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function InputPaymentCVC({
  className,
  size = "default",
  onChange,
  onKeyDown,
  ref,
  ...props
}: InputFieldProps): React.JSX.Element {
  const {
    cardCvc,
    setCardCvc,
    disabled,
    readOnly,
    isInGroup,
    cvcRef,
    expiryRef,
    cardType,
    autoFocusNext,
    errors,
  } = useInputPaymentContext();

  const handleRef = (node: HTMLInputElement | null) => {
    cvcRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvc(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === "Backspace" && !cardCvc && autoFocusNext) {
      expiryRef.current?.focus();
    }
  };

  return (
    <InputPrimitive
      data-size={typeof size === "string" ? size : undefined}
      ref={handleRef}
      type="tel"
      inputMode="numeric"
      size={typeof size === "number" ? size : undefined}
      autoComplete="cc-csc"
      value={cardCvc}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={cardType.code.name}
      aria-label={cardType.code.name}
      maxLength={cardType.code.length}
      aria-invalid={errors.cvc ? true : undefined}
      className={cn(
        "w-14 bg-transparent text-center font-mono outline-none caret-foreground placeholder:text-muted-foreground/60 text-foreground",
        isInGroup
          ? "border-0 p-0 shadow-none ring-0 focus-visible:ring-0"
          : "h-10 sm:h-9 rounded-lg border border-input px-2 text-sm shadow-xs/5 ring-ring/24 focus-visible:border-ring focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function InputPaymentZip({
  className,
  size = "default",
  onChange,
  onKeyDown,
  ref,
  ...props
}: InputFieldProps): React.JSX.Element {
  const {
    cardZip,
    setCardZip,
    disabled,
    readOnly,
    isInGroup,
    zipRef,
    cvcRef,
    autoFocusNext,
    errors,
  } = useInputPaymentContext();

  const handleRef = (node: HTMLInputElement | null) => {
    zipRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardZip(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === "Backspace" && !cardZip && autoFocusNext) {
      cvcRef.current?.focus();
    }
  };

  return (
    <InputPrimitive
      data-size={typeof size === "string" ? size : undefined}
      ref={handleRef}
      type="text"
      size={typeof size === "number" ? size : undefined}
      autoComplete="postal-code"
      value={cardZip}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      readOnly={readOnly}
      placeholder="ZIP"
      aria-label="Postal code"
      maxLength={10}
      aria-invalid={errors.zip ? true : undefined}
      className={cn(
        "w-16 bg-transparent text-center font-mono outline-none caret-foreground placeholder:text-muted-foreground/60 text-foreground",
        isInGroup
          ? "border-0 p-0 shadow-none ring-0 focus-visible:ring-0"
          : "h-10 sm:h-9 rounded-lg border border-input px-2 text-sm shadow-xs/5 ring-ring/24 focus-visible:border-ring focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function InputPaymentUpiId({
  className,
  size = "default",
  onChange,
  ref,
  ...props
}: InputFieldProps): React.JSX.Element {
  const { upiId, setUpiId, disabled, readOnly, isInGroup, upiRef, errors } =
    useInputPaymentContext();

  const handleRef = (node: HTMLInputElement | null) => {
    upiRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
    onChange?.(e);
  };

  return (
    <InputPrimitive
      data-size={typeof size === "string" ? size : undefined}
      ref={handleRef}
      type="text"
      inputMode="email"
      size={typeof size === "number" ? size : undefined}
      autoComplete="off"
      autoCapitalize="off"
      value={upiId}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      placeholder="username@bank (e.g. john@okaxis)"
      aria-label="UPI ID"
      aria-invalid={errors.upi ? true : undefined}
      className={cn(
        "w-full bg-transparent font-mono outline-none caret-foreground placeholder:text-muted-foreground/60 text-foreground",
        isInGroup
          ? "border-0 p-0 shadow-none ring-0 focus-visible:ring-0"
          : "h-10 sm:h-9 rounded-lg border border-input px-3 text-sm shadow-xs/5 ring-ring/24 focus-visible:border-ring focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function InputPaymentBrandIcon({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const { brand } = useInputPaymentContext();

  const defaultProps = {
    className: cn(
      "flex items-center justify-center shrink-0 w-8 select-none",
      className,
    ),
    "data-slot": "input-payment-brand-icon",
  };

  const getBrandSvg = () => {
    switch (brand) {
      case "visa":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Visa</title>
            <path
              d="M9.6 15.6h1.7l1.1-6.4H10.7l-1.1 6.4zm4.2-6.4c-.6-.3-1.1-.4-1.1-.8 0-.3.3-.5.9-.5.6 0 1 .2 1.3.3l.2-1.5c-.4-.1-1-.3-1.8-.3-1.9 0-3.3 1-3.3 2.5 0 1.1 1 1.7 1.7 2 .7.4 1 .6 1 .9 0 .5-.6.7-1.1.7-.8 0-1.3-.2-1.8-.4l-.2 1.5c.5.2 1.3.4 2.1.4 2 0 3.3-1 3.3-2.5 0-1.6-2.6-1.7-2.6-2.3zm7.1 3.2c.1-.3.6-1.7.6-1.7s.1-.3.2-.7l-.1-.1s-.5 2.5-.5 2.5h-1.3l-1.5-6.4h1.8l1.1 3 1.1-3h1.7l-2.6 6.4h-1.4zm-15-3.2L4.2 15.6H2.5L.9 9.2h1.8l.9 4 .9-4h1.4z"
              fill="#1434CB"
            />
            <path d="M4.8 9.2L3.1 15.6H1.4L3 9.2h1.8z" fill="#F7B600" />
          </svg>
        );
      case "mastercard":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Mastercard</title>
            <circle cx="8.5" cy="12" r="5.5" fill="#EB001B" />
            <circle
              cx="15.5"
              cy="12"
              r="5.5"
              fill="#F79E1B"
              fillOpacity="0.85"
            />
            <path
              d="M12 7.7a5.5 5.5 0 00-1.5 4.3 5.5 5.5 0 001.5 4.3 5.5 5.5 0 001.5-4.3 5.5 5.5 0 00-1.5-4.3z"
              fill="#FF5F00"
            />
          </svg>
        );
      case "amex":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>American Express</title>
            <rect width="24" height="16" y="4" rx="2" fill="#006FCF" />
            <path
              d="M4 14.5l.8-2.1h1.4l.8 2.1h1.2l-2-4.9h-1.4l-2 4.9h1.2zm1.5-3.3l.5 1.3h-1l.5-1.3zm3.7 3.3h1.1v-3.7l1.5 3.7h.8l1.5-3.7v3.7h1.1v-4.9h-1.6l-1.4 3.4-1.4-3.4h-1.6v4.9zm8-4.9v4.9h3.6v-1h-2.5v-1h2.2v-1h-2.2v-.9h2.4v-1h-3.5zm-5.4 0l-1.2 2.4-1.2-2.4h-1.4l1.9 3.5-1.9 3.5h1.4l1.2-2.4 1.2 2.4h1.4l-1.9-3.5 1.9-3.5h-1.4z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "rupay":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>RuPay</title>
            <rect width="24" height="16" y="4" rx="2" fill="#0F172A" />
            <path
              d="M4.5 8.5h5.2c1.6 0 2.7.3 3.3.8.5.5.7 1.4.3 2.6-.2.7-.5 1.3-.9 1.8-.4.5-1 1-1.6 1.1.6.1.9.4 1.1.8.2.4.1 1-.1 1.8l-.4 1.6h-1.8l.4-1.6c.2-.6.2-1 0-1.3-.1-.3-.5-.4-1-.4H7.8l-1.1-4h1.6c.6 0 1-.1 1.2-.3.2-.2.3-.5.2-.9-.1-.4-.4-.7-1-.7H7l-1.1-4z"
              fill="#1B3281"
            />
            <path d="M16.5 16.5l3.2-6.4h-6.8l3.2 6.4z" fill="#008C44" />
            <path d="M15.1 16.5l3.2-6.4h-6.8l3.2 6.4z" fill="#F47920" />
          </svg>
        );
      case "discover":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Discover</title>
            <rect width="24" height="16" y="4" rx="2" fill="#1E293B" />
            <circle cx="14.5" cy="12" r="3.2" fill="#F9A01B" />
            <path
              d="M3.5 10.5h1.8c.8 0 1.4.4 1.4 1.2 0 .8-.6 1.3-1.4 1.3H3.5v-2.5zm.9.7v1.1h.8c.4 0 .7-.2.7-.6 0-.3-.3-.5-.7-.5h-.8zM7.5 10.5h.9v3h-.9v-3zM9.2 12.8c.3.2.6.3.9.3.5 0 .8-.2.8-.5 0-.3-.2-.4-.7-.6-.6-.2-1.1-.4-1.1-1 0-.6.5-1 1.2-1 .4 0 .8.1 1.1.3l-.3.6c-.2-.1-.5-.2-.8-.2-.4 0-.6.2-.6.4 0 .3.2.4.7.6.6.2 1.1.4 1.1 1 0 .7-.6 1.1-1.3 1.1-.5 0-.9-.1-1.2-.4l.3-.6z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "dinersclub":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Diners Club</title>
            <rect
              width="24"
              height="16"
              y="4"
              rx="2"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="0.5"
            />
            <circle cx="12" cy="12" r="5" fill="#004A97" />
            <path
              d="M12 7.5a4.5 4.5 0 00-4.5 4.5c0 2.5 2 4.5 4.5 4.5V7.5z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "jcb":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>JCB</title>
            <rect width="6" height="14" x="3" y="5" rx="1.5" fill="#004098" />
            <rect width="6" height="14" x="9" y="5" rx="1.5" fill="#E60012" />
            <rect width="6" height="14" x="15" y="5" rx="1.5" fill="#008D36" />
            <path
              d="M5.5 15.5v-3.5c0-.6.4-1 1-1h.5"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M13.5 11h-2c-.6 0-1 .4-1 1v1.5c0 .6.4 1 1 1h2"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M16.5 11h2c.6 0 1 .3 1 .8s-.3.8-.7.9c.4.1.7.4.7.9s-.4.9-1 .9h-2v-3.5z"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        );
      case "unionpay":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>UnionPay</title>
            <rect
              width="24"
              height="16"
              y="4"
              rx="2"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="0.5"
            />
            <path d="M4 17.5l2.2-11h4.2l-2.2 11H4z" fill="#DD0228" />
            <path d="M8.2 17.5l2.2-11h4.2l-2.2 11H8.2z" fill="#024381" />
            <path
              d="M12.4 17.5l2.2-11h5.4c.6 0 1 .4.9 1l-1.8 9c-.1.6-.6 1-1.2 1h-5.5z"
              fill="#01798A"
            />
          </svg>
        );
      case "mir":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Mir</title>
            <rect width="24" height="16" y="4" rx="2" fill="#008B47" />
            <path d="M14 8h6v8h-6z" fill="#006CB5" />
            <path
              d="M5.5 14.5l.8-4.2h1.4l.8 2.6.8-2.6h1.4l-.8 4.2H8.6l-.8-2.6-.8 2.6H5.5zm8-4.2h2.2c.8 0 1.4.3 1.4.9 0 .5-.3.8-.7 1l.9 2.3h-1.4l-.8-2.1h-.9v2.1h-1.3v-4.2zm1.3 1.1v.9h.8c.2 0 .4-.1.4-.4 0-.3-.2-.5-.4-.5h-.8z"
              fill="#FFFFFF"
            />
          </svg>
        );
      default:
        return <CreditCard className="size-4 text-muted-foreground/80" />;
    }
  };

  const defaultContent = getBrandSvg();

  const mergedProps = mergeProps<"div">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = defaultContent;
  }

  return useRender({
    defaultTagName: "div",
    props: mergedProps,
    render,
  });
}

function InputPaymentUpiProviderIcon({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const { upiProvider } = useInputPaymentContext();

  const defaultProps = {
    className: cn(
      "flex items-center justify-center shrink-0 w-8 select-none",
      className,
    ),
    "data-slot": "input-payment-upi-provider-icon",
  };

  const getProviderSvg = () => {
    switch (upiProvider) {
      case "gpay":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Google Pay</title>
            <rect width="24" height="16" y="4" rx="2" fill="#1E293B" />
            <path
              d="M7.8 11.6v.9h2.3c-.1.6-.7 1.7-2.3 1.7-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5c.8 0 1.3.3 1.6.6l.7-.7C9.6 8.6 8.8 8.2 7.8 8.2c-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8c2.2 0 3.6-1.5 3.6-3.7 0-.3 0-.5-.1-.7H7.8z"
              fill="#4285F4"
            />
            <path
              d="M13.5 10.2h1.5v4.5h-1.5v-.5c-.3.4-.8.6-1.4.6-1.3 0-2.2-1-2.2-2.3s.9-2.3 2.2-2.3c.6 0 1.1.2 1.4.6v-.6zm-1.1 3.5c.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2-1.2.5-1.2 1.2.5 1.2 1.2 1.2z"
              fill="#34A853"
            />
            <path
              d="M16 10.2l1.6 4h.1l1.5-4h1.6l-2.4 5.5h-1.5l.9-2.1-2.2-3.4H16z"
              fill="#EA4335"
            />
          </svg>
        );
      case "phonepe":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>PhonePe</title>
            <rect width="24" height="16" y="4" rx="2" fill="#5F259F" />
            <path
              d="M8.5 7.5h4c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-2.5v3.5h-1.5v-8.5zm1.5 3.5h2.5c.6 0 1-.4 1-1s-.4-1-1-1h-2.5v2z"
              fill="#FFFFFF"
            />
            <path d="M12.5 11.5l3.5 5h-1.8l-3.2-4.5h1.5z" fill="#FFFFFF" />
          </svg>
        );
      case "paytm":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Paytm</title>
            <rect width="24" height="16" y="4" rx="2" fill="#002E6E" />
            <path
              d="M4.5 8.5h3.2c.8 0 1.3.5 1.3 1.2s-.5 1.2-1.3 1.2H6.2v2.6H4.5v-5zm1.7 1.3h1.4c.2 0 .4-.1.4-.3s-.2-.3-.4-.3H6.2v.6zM10.2 8.5h1.7v5h-1.7v-5zM13.2 8.5h1.7l1.2 3.2 1.2-3.2h1.7v5h-1.5v-3.5l-1.1 3.5h-.7l-1.1-3.5v3.5h-1.7v-5z"
              fill="#00BAF2"
            />
          </svg>
        );
      case "amazonpay":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>Amazon Pay</title>
            <rect width="24" height="16" y="4" rx="2" fill="#141920" />
            <path
              d="M4.5 10.5h1.1v2.5H4.5v-2.5zm2.2.8c0-.6.4-.9 1-.9.6 0 1 .3 1 .9v1.7H7.6v-.4c-.2.3-.5.5-.9.5-.6 0-1-.4-1-.9 0-.6.4-.9 1-.9h1v-.1c0-.3-.2-.4-.5-.4-.3 0-.5.1-.6.3l-.9-.2zm1.9.9v-.4h-.9c-.3 0-.5.1-.5.4 0 .2.2.4.5.4.4 0 .9-.2.9-.4zM10.2 10.5h1v.4c.2-.3.6-.5 1-.5.5 0 .9.2 1.1.7.3-.5.7-.7 1.2-.7.7 0 1.2.4 1.2 1.2v1.9h-1v-1.7c0-.4-.2-.6-.6-.6s-.7.3-.7.7v1.6h-1v-1.7c0-.4-.2-.6-.6-.6s-.6.3-.6.7v1.6h-1v-2.5z"
              fill="#FFFFFF"
            />
            <path
              d="M4.5 14.5c3.2 1.2 7.8 1.2 11 0l.4.5c-3.5 1.4-8.3 1.4-11.8 0l.4-.5z"
              fill="#FF9900"
            />
          </svg>
        );
      case "bhim":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>BHIM UPI</title>
            <rect width="24" height="16" y="4" rx="2" fill="#0F172A" />
            <path
              d="M5.5 7.5h5.5c1.4 0 2.2.6 2.2 1.6 0 .7-.4 1.2-1 1.4.8.2 1.3.8 1.3 1.6 0 1.2-.9 1.9-2.5 1.9H5.5v-6.5zm2 2v1.2h3c.4 0 .7-.2.7-.6s-.3-.6-.7-.6h-3zm0 2.2v1.3h3.2c.5 0 .8-.2.8-.6 0-.5-.3-.7-.8-.7h-3.2z"
              fill="#FFFFFF"
            />
            <path d="M14.5 15.5l3.5-7h2l-3.5 7h-2z" fill="#FF6600" />
            <path d="M17.5 15.5l3.5-7h2l-3.5 7h-2z" fill="#009933" />
          </svg>
        );
      case "cred":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>CRED</title>
            <rect width="24" height="16" y="4" rx="2" fill="#000000" />
            <path
              d="M6 7.5h12v9H6v-9zm2 2v5h8v-5H8zm2 1.5h4v2h-4v-2z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "whatsapp":
        return (
          <svg viewBox="0 0 24 24" className="size-auto w-6 h-4">
            <title>WhatsApp Pay</title>
            <rect width="24" height="16" y="4" rx="2" fill="#25D366" />
            <path
              d="M12 7c-2.8 0-5 2.2-5 5 0 .9.2 1.8.7 2.5L7 17l2.6-.7c.7.4 1.5.7 2.4.7 2.8 0 5-2.2 5-5s-2.2-5-5-5zm0 8.2c-.8 0-1.5-.2-2.1-.6l-.2-.1-1.5.4.4-1.5-.1-.2c-.4-.6-.6-1.3-.6-2.1 0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2-1.9 4.1-4.3 4.1z"
              fill="#FFFFFF"
            />
          </svg>
        );
      default:
        return <Zap className="size-4 text-amber-500" />;
    }
  };

  const defaultContent = getProviderSvg();

  const mergedProps = mergeProps<"div">(defaultProps, props);
  if (mergedProps.children === undefined) {
    mergedProps.children = defaultContent;
  }

  return useRender({
    defaultTagName: "div",
    props: mergedProps,
    render,
  });
}

// ============================================================================
// Exports & Backward-Compatible Aliases
// ============================================================================

const PaymentInput = InputPayment;
const PaymentInputGroup = InputPaymentGroup;
const PaymentInputCardNumber = InputPaymentCardNumber;
const PaymentInputExpiry = InputPaymentExpiry;
const PaymentInputCVC = InputPaymentCVC;
const PaymentInputZip = InputPaymentZip;
const PaymentInputBrandIcon = InputPaymentBrandIcon;
const PaymentInputUpiGroup = InputPaymentUpiGroup;
const PaymentInputUpiId = InputPaymentUpiId;
const PaymentInputUpiProviderIcon = InputPaymentUpiProviderIcon;
const PaymentInputMethodSelector = InputPaymentMethodSelector;

export {
  InputPayment,
  InputPaymentBrandIcon,
  InputPaymentCardNumber,
  InputPaymentCVC,
  InputPaymentExpiry,
  InputPaymentGroup,
  InputPaymentMethodSelector,
  InputPaymentUpiGroup,
  InputPaymentUpiId,
  InputPaymentUpiProviderIcon,
  InputPaymentZip,
  PaymentInput,
  PaymentInputBrandIcon,
  PaymentInputCardNumber,
  PaymentInputCVC,
  PaymentInputExpiry,
  PaymentInputGroup,
  PaymentInputMethodSelector,
  PaymentInputUpiGroup,
  PaymentInputUpiId,
  PaymentInputUpiProviderIcon,
  PaymentInputZip,
};
