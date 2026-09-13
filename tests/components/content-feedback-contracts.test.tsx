import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Circle as CircleIcon } from "xiod-icons/icons/Circle";

import {
  AgentStep,
  AgentStepIcon,
  AgentStepLabel,
  AgentSteps,
  agentStepsVariants,
} from "../../src/components/agent-steps";
import { DotMatrix } from "../../src/components/dot-matrix";
import { Gauge } from "../../src/components/gauge";
import { Loader, loaderVariants } from "../../src/components/loader";
import {
  Bubble,
  BubbleContent,
  BubbleReactions,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  bubbleReactionsVariants,
  bubbleVariants,
} from "../../src/components/message";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../../src/components/tabs";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
  timelineIndicatorVariants,
  useTimeline,
} from "../../src/components/timeline";

function AdvanceTimeline() {
  const timeline = useTimeline();
  return (
    <>
      <output aria-label="Active step">{timeline?.activeStep}</output>
      <button onClick={() => timeline?.setActiveStep(2)} type="button">
        Advance
      </button>
    </>
  );
}

describe("agent progress contracts", () => {
  it("preserves status icon weight and accepts XiodIcons components", () => {
    const { container, rerender } = render(
      <AgentSteps label="Complete" status="completed" />,
    );
    for (const status of ["completed", "failed"] as const) {
      rerender(<AgentSteps label={status} status={status} />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon?.querySelector("path")).toHaveAttribute("stroke-width", "3");
    }
    rerender(<AgentSteps label="Custom" status="running" icon={CircleIcon} />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 24 24",
    );
    expect(screen.getByText("Custom")).toBeVisible();
  });

  it("renders every step status and cycles the compatibility API", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <AgentSteps interval={100} steps={["Planning", "Executing"]} />,
    );

    expect(screen.getByText("Planning")).toBeVisible();
    await act(async () => vi.advanceTimersByTimeAsync(100));
    expect(screen.getByText("Executing")).toBeVisible();

    const statuses = ["waiting", "running", "completed", "failed"] as const;
    const { rerender } = render(
      <AgentSteps size="lg">
        {statuses.map((status) => (
          <AgentStep key={status} status={status}>
            <AgentStepIcon
              icon={status === "running" ? CircleIcon : undefined}
            />
            <AgentStepLabel shimmer={false}>{status}</AgentStepLabel>
          </AgentStep>
        ))}
      </AgentSteps>,
    );

    for (const status of statuses) {
      expect(
        container.ownerDocument.querySelector(`[data-status="${status}"]`),
      ).not.toBeNull();
    }
    expect(agentStepsVariants({ size: "sm" })).toContain("text-xs");
    expect(agentStepsVariants({ size: "lg" })).toContain("text-base");
    rerender(<AgentSteps label="Done" status="completed" />);
    expect(screen.getByText("Done")).toBeVisible();
    vi.useRealTimers();
  });
});

describe("visual status contracts", () => {
  it("renders every loader state with an accessible status", () => {
    const variants = [
      "ring",
      "expressive",
      "pulse",
      "dots",
      "circular-arrows",
      "radial-pulse",
      "arc-head",
      "segmented-ring",
      "chunked-circular",
      "petal",
      "orbiting-dots",
      "dotted-ring",
      "radial-arrow",
      "bar-segment",
      "orbiting-ball",
    ] as const;

    for (const variant of variants) {
      const { unmount } = render(<Loader variant={variant} />);
      expect(screen.getByRole("status", { name: "Loading" })).toHaveAttribute(
        "data-slot",
        "loader",
      );
      expect(
        loaderVariants({ variant, intent: "success", size: "xl" }),
      ).toContain("text-success");
      unmount();
    }
  });

  it("normalizes gauge bounds and supports custom content", () => {
    const { rerender } = render(
      <Gauge aria-label="Storage" max={0} value={Number.NaN} />,
    );
    const gauge = screen.getByRole("meter", { name: "Storage" });
    expect(gauge).toHaveAttribute("aria-valuemin", "0");
    expect(gauge).toHaveAttribute("aria-valuemax", "100");
    expect(gauge).toHaveAttribute("aria-valuenow", "0");
    expect(gauge.innerHTML).not.toContain("NaN");

    rerender(
      <Gauge
        aria-label="Storage"
        max={10}
        size={-1}
        strokeWidth={Infinity}
        value={20}
      >
        Full
      </Gauge>,
    );
    expect(gauge).toHaveAttribute("aria-valuenow", "10");
    expect(gauge).toHaveAttribute("data-state", "complete");
    expect(gauge).toHaveTextContent("Full");
    expect(gauge.innerHTML).not.toContain("Infinity");
  });

  it("renders all dot shapes as a named graphic with exact grid dimensions", () => {
    for (const shape of ["circle", "square", "diamond", "heart"] as const) {
      const { container, unmount } = render(
        <DotMatrix
          ariaLabel={`${shape} activity`}
          cols={3}
          mode="static"
          pattern={[
            [1, 0, 1],
            [0, 1, 0],
          ]}
          rows={2}
          shape={shape}
        />,
      );
      expect(
        screen.getByRole("img", { name: `${shape} activity` }),
      ).toBeVisible();
      expect(container.querySelectorAll(".dmx-dot-cell")).toHaveLength(6);
      unmount();
    }
  });
});

describe("message and timeline contracts", () => {
  it("renders every message slot, alignment, bubble variant, and polymorphic content", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const variants = [
      "default",
      "secondary",
      "muted",
      "tinted",
      "outline",
      "ghost",
      "destructive",
    ] as const;

    for (const variant of variants) {
      expect(bubbleVariants({ variant })).toContain("group/bubble");
    }
    expect(bubbleReactionsVariants({ align: "start", side: "top" })).toContain(
      "top-0",
    );

    const { container } = render(
      <MessageGroup>
        <Message align="end">
          <MessageAvatar>MK</MessageAvatar>
          <MessageContent>
            <MessageHeader>Author</MessageHeader>
            <Bubble align="end" variant="outline">
              <BubbleContent
                render={
                  <button
                    aria-label="Open response"
                    onClick={onClick}
                    type="button"
                  />
                }
              >
                Open response
              </BubbleContent>
              <BubbleReactions align="start" side="top">
                👍 2
              </BubbleReactions>
            </Bubble>
            <MessageFooter>Delivered</MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Open response" }));
    expect(onClick).toHaveBeenCalledOnce();
    for (const slot of [
      "message-group",
      "message",
      "message-avatar",
      "message-content",
      "message-header",
      "message-footer",
      "bubble",
      "bubble-content",
      "bubble-reactions",
    ]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  it("derives timeline statuses and permits controlled custom navigation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { container } = render(
      <Timeline
        defaultValue={1}
        onValueChange={onValueChange}
        orientation="horizontal"
      >
        {[0, 1, 2].map((step) => (
          <TimelineItem key={step} step={step}>
            <TimelineIndicator size="sm" variant="solid" />
            <TimelineSeparator />
            <TimelineHeader>
              <TimelineTitle>Step {step + 1}</TimelineTitle>
              <TimelineDate dateTime={`2026-09-0${step + 1}`}>
                Day {step + 1}
              </TimelineDate>
            </TimelineHeader>
            <TimelineContent>Details {step + 1}</TimelineContent>
          </TimelineItem>
        ))}
        <AdvanceTimeline />
      </Timeline>,
    );

    const items = container.querySelectorAll('[data-slot="timeline-item"]');
    expect(items[0]).toHaveAttribute("data-status", "completed");
    expect(items[1]).toHaveAttribute("data-status", "active");
    expect(items[2]).toHaveAttribute("data-status", "pending");
    expect(
      timelineIndicatorVariants({ size: "lg", variant: "default" }),
    ).toContain("size-6");
    expect(
      screen.getByRole("status", { name: "Active step" }),
    ).toHaveTextContent("1");
    await user.click(screen.getByRole("button", { name: "Advance" }));
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(
      screen.getByRole("status", { name: "Active step" }),
    ).toHaveTextContent("2");
  });
});

describe("tabs contracts", () => {
  it("supports click activation, disabled tabs, roving focus, and both visual variants", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Sections" variant="underline">
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="usage">Usage</TabsTab>
          <TabsTab disabled value="billing">
            Billing
          </TabsTab>
        </TabsList>
        <TabsPanel value="overview">Overview panel</TabsPanel>
        <TabsPanel value="usage">Usage panel</TabsPanel>
        <TabsPanel value="billing">Billing panel</TabsPanel>
      </Tabs>,
    );

    const overview = screen.getByRole("tab", { name: "Overview" });
    const usage = screen.getByRole("tab", { name: "Usage" });
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
    await user.click(usage);
    expect(usage).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Usage panel");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.keyboard("{ArrowLeft}");
    expect(overview).toHaveFocus();
  });
});
