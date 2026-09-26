import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  BlossomColorPicker,
  ColorPicker,
  computeAdaptivePosition,
} from "../../src/components/color-picker";
import {
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
} from "../../src/components/input-payment";
import { InputPhone } from "../../src/components/input-phone";
import { KineticClick } from "../../src/components/kinetic-click";
import {
  MorphicToaster,
  morphicToast,
} from "../../src/components/morphic-toast";
import { Orb, OrbBadge, OrbLabel } from "../../src/components/orb";
import {
  Waveform,
  WaveformHandle,
  WaveformScrubber,
  WaveformVisual,
} from "../../src/components/waveform";

describe("specialized payment input contracts", () => {
  it("formats and validates card details while moving focus through the fields", async () => {
    const user = userEvent.setup();
    const onValidationChange = vi.fn();
    render(
      <InputPayment onValidationChange={onValidationChange}>
        <InputPaymentMethodSelector />
        <InputPaymentGroup>
          <InputPaymentBrandIcon />
          <InputPaymentCardNumber />
          <InputPaymentExpiry />
          <InputPaymentCVC />
          <InputPaymentZip />
        </InputPaymentGroup>
      </InputPayment>,
    );

    expect(
      screen.getByRole("tablist", { name: "Payment method" }),
    ).toBeVisible();
    const cardNumber = screen.getByRole("textbox", { name: "Card number" });
    const expiry = screen.getByRole("textbox", { name: "Expiration date" });
    const cvc = screen.getByRole("textbox", { name: "CVC" });
    const postalCode = screen.getByRole("textbox", { name: "Postal code" });

    await user.type(cardNumber, "4242424242424242");
    expect(cardNumber).toHaveValue("4242 4242 4242 4242");
    expect(expiry).toHaveFocus();
    await user.type(expiry, "1240");
    expect(expiry).toHaveValue("12/40");
    expect(cvc).toHaveFocus();
    await user.type(cvc, "123");
    expect(postalCode).toHaveFocus();
    await user.type(postalCode, "90210");

    await waitFor(() =>
      expect(onValidationChange).toHaveBeenLastCalledWith(true, {}),
    );
  });

  it("reports invalid card and UPI states with accessible controls", async () => {
    const user = userEvent.setup();
    const onPaymentMethodChange = vi.fn();
    const { container, rerender } = render(
      <InputPayment
        defaultCardNumber="4242 4242 4242 4241"
        onPaymentMethodChange={onPaymentMethodChange}
      >
        <InputPaymentMethodSelector />
        <InputPaymentGroup>
          <InputPaymentCardNumber />
        </InputPaymentGroup>
      </InputPayment>,
    );

    expect(
      screen.getByRole("textbox", { name: "Card number" }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(
      container.querySelector('[data-slot="input-payment-group"]'),
    ).toHaveAttribute("aria-invalid", "true");
    await user.click(screen.getByRole("tab", { name: "UPI" }));
    expect(onPaymentMethodChange).toHaveBeenCalledWith("upi");

    rerender(
      <InputPayment key="upi" defaultPaymentMethod="upi" defaultUpiId="invalid">
        <InputPaymentUpiGroup>
          <InputPaymentUpiProviderIcon />
          <InputPaymentUpiId />
        </InputPaymentUpiGroup>
      </InputPayment>,
    );
    expect(screen.getByRole("textbox", { name: "UPI ID" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("honors disabled and read-only input states", () => {
    const { rerender } = render(
      <InputPayment disabled>
        <InputPaymentMethodSelector />
        <InputPaymentCardNumber />
      </InputPayment>,
    );
    expect(screen.getByRole("textbox", { name: "Card number" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Card" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("tab", { name: "UPI" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    rerender(
      <InputPayment readOnly>
        <InputPaymentMethodSelector />
        <InputPaymentUpiId />
      </InputPayment>,
    );
    expect(screen.getByRole("textbox", { name: "UPI ID" })).toHaveAttribute(
      "readonly",
    );
    expect(screen.getByRole("tab", { name: "Card" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

describe("specialized phone and color input contracts", () => {
  it("formats phone numbers, supports country search, and clears input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputPhone onChange={onChange} />);

    const phone = screen.getByRole("textbox", { name: "Phone number" });
    await user.type(phone, "5551234567");
    expect(phone).toHaveValue("(555) 123-4567");
    expect(onChange).toHaveBeenLastCalledWith(
      "+15551234567",
      expect.objectContaining({ code: "US" }),
      "5551234567",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Select country, current United States (+1)",
      }),
    );
    const search = await screen.findByRole("textbox", {
      name: "Search countries",
    });
    await user.type(search, "India");
    await user.click(screen.getByRole("button", { name: /India/ }));
    expect(
      screen.getByRole("button", {
        name: "Select country, current India (+91)",
      }),
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Clear Phone Number" }),
    );
    expect(phone).toHaveValue("");
  });

  it("parses a pasted international value and honors disabled state", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<InputPhone onChange={onChange} />);
    const phone = screen.getByRole("textbox", { name: "Phone number" });
    await user.click(phone);
    await user.paste("+447911123456");
    expect(onChange).toHaveBeenLastCalledWith(
      "+447911123456",
      expect.objectContaining({ code: "GB" }),
      "7911123456",
    );

    rerender(<InputPhone disabled />);
    expect(
      screen.getByRole("textbox", { name: "Phone number" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Select country/ }),
    ).toBeDisabled();
  });

  it("names every color field and updates opacity and formats", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker animationDuration={0} onChange={onChange} />);

    fireEvent.change(screen.getByRole("slider", { name: "Opacity" }), {
      target: { value: "40" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ alpha: 40 }),
    );
    expect(screen.getByRole("textbox", { name: "Hex color" })).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Switch color format" }),
    );
    for (const name of ["Red", "Green", "Blue", "Alpha"]) {
      expect(screen.getByRole("textbox", { name })).toBeVisible();
    }
    await user.click(
      screen.getByRole("button", { name: "Switch color format" }),
    );
    for (const name of ["Hue", "Saturation", "Lightness", "Alpha"]) {
      expect(screen.getByRole("textbox", { name })).toBeVisible();
    }
  });

  it("operates the arc sliders from the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <>
        <BlossomColorPicker
          collapsible={false}
          animationDuration={0}
          onChange={onChange}
        />
        <BlossomColorPicker collapsible={false} animationDuration={0} />
      </>,
    );

    const [lightness] = screen.getAllByRole("slider", { name: "Lightness" });
    const [opacity] = screen.getAllByRole("slider", { name: "Opacity" });
    expect(lightness).toHaveAttribute("tabindex", "0");
    expect(opacity).toHaveAttribute("aria-valuetext", "50%");

    lightness.focus();
    await user.keyboard("{End}");
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ saturation: 100 }),
    );
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ saturation: 90 }),
    );

    opacity.focus();
    await user.keyboard("{Home}");
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ alpha: 0 }),
    );

    // Two pickers never share an SVG gradient or pattern id.
    const ids = Array.from(
      container.querySelectorAll("linearGradient, pattern"),
      (node) => node.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("disables all color inputs", () => {
    render(<ColorPicker disabled />);
    expect(screen.getByRole("slider", { name: "Opacity" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Hex color" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Switch color format" }),
    ).toBeDisabled();
  });
});

describe("canvas and animated feedback contracts", () => {
  afterEach(() => {
    act(() => morphicToast.clear());
  });

  it("creates one shared kinetic canvas and releases it on final unmount", async () => {
    const { container, unmount } = render(
      <KineticClick duration={1} trigger="click">
        <button type="button">Celebrate</button>
      </KineticClick>,
    );
    await waitFor(() =>
      expect(
        document.querySelectorAll('[data-slot="kinetic-click-canvas"]'),
      ).toHaveLength(1),
    );
    expect(
      document.querySelector('[data-slot="kinetic-click-canvas"]'),
    ).toHaveAttribute("aria-hidden", "true");
    fireEvent.click(container.querySelector('[data-slot="kinetic-click"]')!, {
      clientX: 10,
      clientY: 20,
    });
    unmount();
    expect(
      document.querySelector('[data-slot="kinetic-click-canvas"]'),
    ).not.toBeInTheDocument();
  });

  it("exposes the orb state and composition slots without exposing its canvas", () => {
    const { container } = render(
      <OrbBadge>
        <Orb paused state="listening" />
        <OrbLabel>Listening</OrbLabel>
      </OrbBadge>,
    );
    expect(screen.getByRole("status", { name: /listening/i })).toBeVisible();
    expect(container.querySelector('[data-slot="orb"] canvas')).toBeVisible();
    expect(
      container.querySelector('[data-slot="orb-label"]'),
    ).toHaveTextContent("Listening");
  });

  it("supports waveform keyboard seeking and clamped handle positioning", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Waveform duration={100} onValueChange={onValueChange} value={50}>
        <WaveformVisual />
        <WaveformHandle />
        <WaveformScrubber />
      </Waveform>,
    );
    const scrubber = screen.getByRole("slider", {
      name: "Audio waveform scrubber",
    });
    expect(scrubber).toHaveAttribute("aria-valuenow", "50");
    await user.click(scrubber);
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith(51);
    await user.keyboard("{PageUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(60);
    await user.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    await user.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(100);
    expect(
      container.querySelector('[data-slot="waveform-handle"]'),
    ).toHaveStyle({
      left: "50%",
    });
  });

  it("announces morphic toast state, promise transitions, and dismissal", async () => {
    render(<MorphicToaster />);
    let id = "";
    act(() => {
      id = morphicToast.success({
        description: "Saved safely",
        duration: null,
        title: "Saved",
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Saved");

    act(() => morphicToast.dismiss(id));
    expect(screen.getByRole("status")).toHaveAttribute("data-exiting", "true");
    act(() => morphicToast.clear());

    await act(async () => {
      await morphicToast.promise(Promise.resolve("report"), {
        error: { title: "Failed" },
        loading: { title: "Saving" },
        success: (name) => ({ title: `${name} saved` }),
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent("report saved");
  });
});

// The two arcs sit on opposite sides, so "right" means left AND right.
const at = (
  centerX: number,
  centerY: number,
  windowWidth: number,
  windowHeight: number,
  overrides: Partial<Parameters<typeof computeAdaptivePosition>[0]> = {},
) => {
  const containerSize = 265;
  return computeAdaptivePosition({
    adaptivePositioning: true,
    circularBarWidth: 12,
    containerSize,
    currentShiftOffset: { x: 0, y: 0 },
    elementRect: {
      height: containerSize,
      left: centerX - containerSize / 2,
      top: centerY - containerSize / 2,
      width: containerSize,
    } as DOMRect,
    sliderOffset: 30,
    windowWidth,
    windowHeight,
    ...overrides,
  }).effectivePosition;
};

describe("computeAdaptivePosition", () => {
  it("keeps the arcs horizontal when both sides have room but the top is tight", () => {
    // Regression: a cramped top used to force a vertical placement even though
    // left and right each had more than double the required clearance.
    expect(at(267, 166, 533, 416)).toBe("left");
  });

  it("falls back to vertical only when the horizontal axis cannot fit", () => {
    expect(at(150, 400, 300, 800)).toBe("bottom");
    expect(at(100, 450, 200, 900)).toBe("bottom");
  });

  it("stays horizontal in a roomy viewport", () => {
    expect(at(720, 450, 1440, 900)).toBe("right");
  });

  it("does not adapt when adaptive positioning is disabled", () => {
    // Must match the resting value the component collapses back to, or the
    // arcs jump sides while they fade out.
    expect(at(267, 166, 533, 416, { adaptivePositioning: false })).toBe(
      "right",
    );
  });

  it("honours an explicit sliderPosition", () => {
    expect(at(267, 166, 533, 416, { sliderPosition: "top" })).toBe("top");
    expect(
      at(267, 166, 533, 416, {
        adaptivePositioning: false,
        sliderPosition: "bottom",
      }),
    ).toBe("bottom");
  });
});
