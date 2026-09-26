import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Circle } from "xiod-icons/icons/Circle";
import { Square } from "xiod-icons/icons/Square";

import {
  checkboxIndicatorVariants,
  checkboxItemVariants,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
} from "../../src/components/checkbox";
import { CircularProgress } from "../../src/components/circular-progress";
import {
  CopyToClipboard,
  copyToClipboardVariants,
} from "../../src/components/copy-to-clipboard";
import { DatePicker } from "../../src/components/date-picker";
import {
  FileUpload,
  FileUploadInput,
  FileUploadItem,
  FileUploadItemRemove,
  FileUploadItemStatus,
  FileUploadList,
  FileUploadTrigger,
  type FileItem,
  formatFileSize,
} from "../../src/components/file-upload";
import { Input } from "../../src/components/input";
import {
  InputOtp,
  InputOtpGroup,
  InputOtpInput,
  InputOtpSeparator,
} from "../../src/components/input-otp";
import { InputSensitive } from "../../src/components/input-sensitive";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "../../src/components/meter";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "../../src/components/number-field";
import { OptionPicker } from "../../src/components/option-picker";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  progressIndicatorVariants,
  progressTrackVariants,
  ProgressTrack,
  ProgressValue,
} from "../../src/components/progress";
import {
  Radio,
  radioIndicatorVariants,
  radioItemVariants,
  RadioItem,
} from "../../src/components/radio";
import {
  Slider,
  sliderVariants,
  SliderValue,
} from "../../src/components/slider";
import { Textarea } from "../../src/components/textarea";
import { Toggle, toggleVariants } from "../../src/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupSeparator,
} from "../../src/components/toggle-group";

describe("form-control visual states", () => {
  it.each(["default", "diamond", "expressive", "sharp"] as const)(
    "supports the %s checkbox and radio shape",
    (variant) => {
      expect(checkboxItemVariants({ variant })).toContain("border-input");
      expect(checkboxIndicatorVariants({ variant })).toContain("absolute");
      expect(radioItemVariants({ variant })).toContain("border-input");
      expect(radioIndicatorVariants({ variant })).toContain("absolute");
    },
  );

  it.each([
    "default",
    "expressive",
    "classic",
    "fader",
    "segmented",
    "dotted",
  ] as const)("supports the %s slider variant", (variant) => {
    expect(sliderVariants({ variant })).toBeTypeOf("string");
  });

  it("covers progress, toggle, and copy sizing variants", () => {
    for (const size of ["sm", "default", "lg", "xl", "2xl"] as const) {
      expect(progressTrackVariants({ size, variant: "default" })).toContain(
        "rounded-full",
      );
      expect(progressTrackVariants({ size, variant: "expressive" })).toContain(
        "mask-image",
      );
    }
    expect(progressIndicatorVariants({ variant: "expressive" })).toContain(
      "bg-primary",
    );
    expect(toggleVariants({ size: "sm", variant: "outline" })).toContain(
      "border-input",
    );
    expect(copyToClipboardVariants({ size: "lg" })).toContain("h-9.5");
  });
});

describe("native input contracts", () => {
  it("forwards input and textarea state and events", async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    const onTextareaChange = vi.fn();

    render(
      <>
        <Input
          aria-invalid="true"
          aria-label="Email"
          nativeInput
          onChange={onInputChange}
          placeholder="name@example.com"
          size="lg"
          type="email"
        />
        <Textarea
          aria-label="Notes"
          disabled
          onChange={onTextareaChange}
          size="sm"
        />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.type(input, "person@example.com");
    expect(onInputChange).toHaveBeenCalled();
    expect(input).toHaveValue("person@example.com");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeDisabled();
    expect(onTextareaChange).not.toHaveBeenCalled();
  });

  it("covers sensitive-input empty, revealed, masked, copied, and disabled states", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const onCopy = vi.fn();
    const { rerender } = render(
      <InputSensitive
        aria-label="API key"
        defaultValue="secret-token"
        onCopy={onCopy}
      />,
    );

    const maskedControl = screen.getByRole("button", { name: "API key" });
    await user.keyboard("{Tab}");
    expect(maskedControl).toHaveFocus();
    await user.keyboard("{Enter}");

    const input = screen.getByRole("textbox", { name: "API key" });
    await waitFor(() => expect(input).toHaveFocus());
    expect(input).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Copy to clipboard" }));
    expect(writeText).toHaveBeenCalledWith("secret-token");
    expect(onCopy).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Copied" })).toBeVisible();

    input.focus();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "API key" })).toHaveFocus();
    });

    rerender(<InputSensitive aria-label="API key" disabled value="locked" />);
    expect(
      screen.getByLabelText("API key", { selector: "input" }),
    ).toBeDisabled();
  });
});

describe("selection control contracts", () => {
  it("supports checkbox group, checked, indeterminate, disabled, and invalid states", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup onValueChange={onValueChange}>
        <CheckboxGroupItem aria-label="Alpha" value="alpha" />
        <Checkbox aria-label="Mixed" indeterminate />
        <Checkbox aria-invalid="true" aria-label="Invalid" />
        <Checkbox aria-label="Disabled" disabled />
      </CheckboxGroup>,
    );

    await user.click(screen.getByRole("checkbox", { name: "Alpha" }));
    expect(onValueChange).toHaveBeenCalledWith(["alpha"], expect.anything());
    expect(
      screen.getByRole("checkbox", { name: "Mixed" }),
    ).toBePartiallyChecked();
    expect(screen.getByRole("checkbox", { name: "Invalid" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("changes radio selection with click and arrow-key navigation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Radio defaultValue="one" onValueChange={onValueChange}>
        <RadioItem aria-label="One" value="one" />
        <RadioItem aria-label="Two" value="two" variant="expressive" />
        <RadioItem aria-label="Three" disabled value="three" />
      </Radio>,
    );

    const first = screen.getByRole("radio", { name: "One" });
    first.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Two" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("two", expect.anything());
    expect(screen.getByRole("radio", { name: "Three" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("toggles standalone and grouped pressed states while respecting disabled controls", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Toggle aria-label="Pin" defaultPressed />
        <Toggle aria-label="Unavailable" disabled />
        <ToggleGroup defaultValue={["bold"]}>
          <ToggleGroupItem aria-label="Bold" value="bold" />
          <ToggleGroupSeparator />
          <ToggleGroupItem aria-label="Italic" value="italic" />
        </ToggleGroup>
      </>,
    );

    const pin = screen.getByRole("button", { name: "Pin" });
    expect(pin).toHaveAttribute("aria-pressed", "true");
    await user.click(pin);
    expect(pin).toHaveAttribute("aria-pressed", "false");

    const italic = screen.getByRole("button", { name: "Italic" });
    await user.click(italic);
    expect(italic).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
});

describe("numeric and progress contracts", () => {
  it("increments, decrements, clamps, and labels a number field", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <NumberField
        defaultValue={2}
        max={3}
        min={1}
        onValueChange={onValueChange}
      >
        <NumberFieldScrubArea label="Quantity" />
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label="Decrease" />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase" />
        </NumberFieldGroup>
      </NumberField>,
    );

    const input = screen.getByRole("textbox", { name: "Quantity" });
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("3");
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(input).toHaveValue("3");
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(input).toHaveValue("2");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("updates a slider through the keyboard and exposes value state", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Slider defaultValue={25} onValueChange={onValueChange} step={5}>
        <SliderValue />
      </Slider>,
    );

    const slider = document.querySelector<HTMLInputElement>(
      'input[type="range"]',
    );
    expect(slider).not.toBeNull();
    slider!.focus();
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "30");
    expect(onValueChange).toHaveBeenCalledWith(30, expect.anything());
    expect(screen.getByText("30")).toHaveAttribute("data-slot", "slider-value");
  });

  it("renders determinate, indeterminate, expressive, and clamped progress states", () => {
    const { container } = render(
      <>
        <Progress value={42}>
          <ProgressLabel>Upload</ProgressLabel>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
          <ProgressValue />
        </Progress>
        <Progress aria-label="Loading" value={null} variant="expressive" />
        <Meter max={100} value={64}>
          <MeterLabel>Storage</MeterLabel>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
          <MeterValue />
        </Meter>
        <CircularProgress
          aria-label="Complete"
          max={100}
          size={64}
          value={120}
        />
        <CircularProgress aria-label="Pending" variant="expressive" />
      </>,
    );

    const progressbars = screen.getAllByRole("progressbar");
    expect(progressbars).toHaveLength(4);
    expect(
      screen.getByRole("progressbar", { name: "Complete" }),
    ).toHaveAttribute("aria-valuenow", "100");
    expect(
      screen.getByRole("progressbar", { name: "Pending" }),
    ).not.toHaveAttribute("aria-valuenow");
    expect(
      container.querySelector('[data-slot="meter-indicator"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="progress-indicator"]'),
    ).not.toBeNull();
  });
});

describe("compound input contracts", () => {
  it("accepts OTP input and renders grouped slots", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <InputOtp length={4} onValueChange={onValueChange}>
        <InputOtpGroup>
          <InputOtpInput />
          <InputOtpInput />
          <InputOtpSeparator />
          <InputOtpInput />
          <InputOtpInput />
        </InputOtpGroup>
      </InputOtp>,
    );

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1234");
    expect(onValueChange).toHaveBeenLastCalledWith("1234", expect.anything());
    expect(inputs).toHaveLength(4);
  });

  it("supports typed single and range dates, including clearing", async () => {
    const user = userEvent.setup();
    const onSingleSelect = vi.fn();
    const onRangeSelect = vi.fn();

    const { container } = render(
      <>
        <DatePicker onSelect={onSingleSelect} triggerType="input" />
        <DatePicker mode="range" onSelect={onRangeSelect} triggerType="input" />
      </>,
    );

    const single = container.querySelector<HTMLInputElement>(
      '[data-slot="date-picker-input"]',
    );
    const from = container.querySelector<HTMLInputElement>(
      '[data-slot="date-picker-input-from"]',
    );
    const to = container.querySelector<HTMLInputElement>(
      '[data-slot="date-picker-input-to"]',
    );
    expect(single).not.toBeNull();
    expect(from).not.toBeNull();
    expect(to).not.toBeNull();

    await user.type(single!, "2026-09-20");
    expect(onSingleSelect).toHaveBeenLastCalledWith(new Date(2026, 8, 20));
    fireEvent.change(from!, { target: { value: "2026-09-21" } });
    fireEvent.change(to!, { target: { value: "2026-09-24" } });
    expect(onRangeSelect).toHaveBeenLastCalledWith({
      from: new Date(2026, 8, 21),
      to: new Date(2026, 8, 24),
    });
    await user.clear(single!);
    expect(onSingleSelect).toHaveBeenLastCalledWith(undefined);
  });

  it("selects an option and supports controlled selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { icon: Circle, id: "circle", label: "Circle" },
      { icon: Square, id: "square", label: "Square" },
    ];

    const { rerender } = render(
      <OptionPicker
        defaultValue="circle"
        onChange={onChange}
        options={options}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Circle/ }));
    await user.click(screen.getByRole("button", { name: "Select Square" }));
    expect(onChange).toHaveBeenCalledWith("square");
    expect(screen.getByRole("button", { name: /Square/ })).toBeVisible();

    rerender(
      <OptionPicker onChange={onChange} options={options} value="circle" />,
    );
    expect(screen.getByRole("button", { name: /Circle/ })).toBeVisible();
  });

  it("copies text with and without a tooltip", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(
      <CopyToClipboard
        copiedText="Token copied"
        disableTooltip
        text="Visible token"
        textToCopy="private-token"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("private-token");
  });

  it("validates file count, size, type, keyboard trigger, and disabled input", async () => {
    const user = userEvent.setup();
    const onFilesAdded = vi.fn();
    const onFilesChange = vi.fn();
    const { rerender } = render(
      <FileUpload
        accept="image/*,.pdf"
        maxFiles={2}
        maxSizeMB={1}
        onFilesAdded={onFilesAdded}
        onFilesChange={onFilesChange}
      >
        <FileUploadTrigger>Choose files</FileUploadTrigger>
        <FileUploadInput aria-label="Files" />
      </FileUpload>,
    );

    const input = screen.getByLabelText("Files");
    const valid = new File(["image"], "photo.png", { type: "image/png" });
    const invalid = new File(["text"], "notes.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [valid, invalid] } });
    expect(onFilesAdded).toHaveBeenCalledWith([valid, invalid]);
    expect(onFilesChange.mock.calls[0]?.[0][0]).toMatchObject({
      status: "idle",
    });
    expect(onFilesChange.mock.calls[0]?.[0][1]).toMatchObject({
      errorMessage: "Invalid file type",
      status: "error",
    });
    expect(formatFileSize(0)).toBe("0 Bytes");
    expect(formatFileSize(1536)).toBe("1.5 KB");

    const trigger = screen.getByRole("button", { name: "Choose files" });
    const clickSpy = vi.spyOn(input as HTMLInputElement, "click");
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(clickSpy).toHaveBeenCalledOnce();

    rerender(
      <FileUpload disabled>
        <FileUploadTrigger>Choose files</FileUploadTrigger>
        <FileUploadInput aria-label="Files" />
      </FileUpload>,
    );
    expect(screen.getByLabelText("Files")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Choose files" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("reports rejected files, announces changes and keeps focus on removal", async () => {
    const user = userEvent.setup();
    const onFilesRejected = vi.fn();
    function Harness() {
      const [files, setFiles] = React.useState<FileItem[]>([]);
      return (
        <FileUpload
          files={files}
          onFilesChange={setFiles}
          maxFiles={2}
          maxSizeMB={1}
          onFilesRejected={onFilesRejected}
        >
          <FileUploadTrigger>
            <span>Drop files</span>
          </FileUploadTrigger>
          <FileUploadInput aria-label="Files" />
          <FileUploadList>
            {files.map((item) => (
              <FileUploadItem key={item.id} fileItem={item}>
                <FileUploadItemStatus />
                <FileUploadItemRemove />
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      );
    }
    const { container } = render(<Harness />);
    const announcer = () =>
      container.querySelector("[data-slot=file-upload-announcer]");
    const big = new File([new Uint8Array(2 * 1024 * 1024)], "big.png");
    const a = new File(["a"], "a.png");
    const c = new File(["c"], "c.png");
    fireEvent.change(screen.getByLabelText("Files"), {
      target: { files: [a, big, c] },
    });

    expect(onFilesRejected).toHaveBeenCalledWith([c]);
    expect(announcer()).toHaveTextContent(
      "Added 1 file. 1 file can't be uploaded: big.png, File exceeds max size of 1MB. 1 file not added: the limit is 2 files.",
    );
    // The error is readable without hovering for the title.
    expect(screen.getByText("Failed")).toHaveTextContent(
      "Failed: File exceeds max size of 1MB",
    );

    const removeA = screen.getByRole("button", { name: "Remove a.png" });
    removeA.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Remove big.png" }),
      ).toHaveFocus(),
    );
    expect(announcer()).toHaveTextContent("Removed a.png");

    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Drop files" })).toHaveFocus(),
    );

    // Crossing onto a child doesn't end the drag highlight.
    const zone = screen.getByRole("button", { name: "Drop files" });
    const dataTransfer = { types: ["Files"], dropEffect: "none", files: [] };
    fireEvent.dragOver(zone, { dataTransfer });
    expect(zone).toHaveAttribute("data-dragging", "true");
    // jsdom has no DragEvent, so relatedTarget has to be set by hand.
    function dragLeave(relatedTarget: Element) {
      const event = createEvent.dragLeave(zone, { dataTransfer });
      Object.defineProperty(event, "relatedTarget", { value: relatedTarget });
      fireEvent(zone, event);
    }
    dragLeave(zone.querySelector("span")!);
    expect(zone).toHaveAttribute("data-dragging", "true");
    dragLeave(document.body);
    expect(zone).not.toHaveAttribute("data-dragging");
    // A text drag isn't a file drag.
    fireEvent.dragOver(zone, { dataTransfer: { types: ["text/plain"] } });
    expect(zone).not.toHaveAttribute("data-dragging");
  });
});
