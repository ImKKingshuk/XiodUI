import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  alertVariants,
} from "../../src/components/alert";
import { AspectRatio } from "../../src/components/aspect-ratio";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  avatarVariants,
} from "../../src/components/avatar";
import { Badge, badgeVariants } from "../../src/components/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../src/components/breadcrumb";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from "../../src/components/button-group";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardFrame,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardHeader,
  CardPanel,
  CardTitle,
} from "../../src/components/card";
import {
  CornerBadge,
  CornerBadgeAnchor,
  cornerBadgeVariants,
} from "../../src/components/corner-badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  emptyMediaVariants,
} from "../../src/components/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
} from "../../src/components/field";
import { Fieldset, FieldsetLegend } from "../../src/components/fieldset";
import { Form } from "../../src/components/form";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "../../src/components/frame";
import {
  Grid,
  GridItem,
  gridItemVariants,
  gridVariants,
} from "../../src/components/grid";
import {
  Group,
  GroupSeparator,
  GroupText,
  groupVariants,
} from "../../src/components/group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  inputGroupAddonVariants,
} from "../../src/components/input-group";
import { Kbd, KbdGroup } from "../../src/components/kbd";
import { Label } from "../../src/components/label";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
  markerVariants,
} from "../../src/components/marker";
import { Separator } from "../../src/components/separator";
import { Skeleton } from "../../src/components/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/table";
import { Text, textVariants } from "../../src/components/text";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "../../src/components/toolbar";

describe("visual variant contracts", () => {
  it.each(["default", "error", "info", "success", "warning"] as const)(
    "Alert supports the %s state",
    (variant) => {
      expect(alertVariants({ variant })).toContain("rounded-xl");
    },
  );

  it.each([
    "default",
    "destructive",
    "error",
    "info",
    "outline",
    "secondary",
    "success",
    "warning",
  ] as const)("Badge supports the %s state", (variant) => {
    expect(badgeVariants({ variant })).toContain("inline-flex");
  });

  it.each(["xs", "sm", "md", "lg", "xl", "2xl"] as const)(
    "Avatar supports the %s size",
    (size) => {
      expect(avatarVariants({ size })).toContain("inline-flex");
    },
  );

  it.each(["horizontal", "vertical"] as const)(
    "group components support %s orientation",
    (orientation) => {
      expect(groupVariants({ orientation })).toContain("flex");
      expect(buttonGroupVariants({ orientation })).toContain("inline-flex");
    },
  );

  it("covers layout, marker, empty, corner-badge, and text variants", () => {
    expect(gridVariants({ columns: 12, flow: "row-dense", gap: "xl" })).toMatch(
      /grid-cols-12.*grid-flow-row-dense.*gap-12/,
    );
    expect(
      gridItemVariants({ colSpan: "full", rowStart: 2, rowEnd: 4 }),
    ).toMatch(/col-span-full.*row-start-2.*row-end-4/);
    expect(markerVariants({ size: "lg", variant: "separator" })).toContain(
      "before:flex-1",
    );
    expect(emptyMediaVariants({ variant: "icon" })).toContain("rounded-md");
    expect(
      cornerBadgeVariants({
        dot: true,
        overlap: "circular",
        position: "bottom-left",
      }),
    ).toContain("bottom-[14.6%]");
    expect(textVariants({ truncate: true, variant: "mono" })).toContain(
      "truncate",
    );
    expect(inputGroupAddonVariants({ align: "block-end" })).toContain(
      "order-last",
    );
  });
});

describe("presentational component contracts", () => {
  it("renders a complete alert composition and consumer actions", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Alert variant="warning">
        <AlertTitle>Connection warning</AlertTitle>
        <AlertDescription>Connection is unstable.</AlertDescription>
        <AlertAction>
          <button type="button" onClick={onClick}>
            Retry
          </button>
        </AlertAction>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-slot", "alert");
    expect(within(alert).getByText("Connection warning")).toHaveAttribute(
      "data-slot",
      "alert-title",
    );
    await user.click(within(alert).getByRole("button", { name: "Retry" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports polymorphic layout primitives and merged styles", () => {
    render(
      <>
        <AspectRatio
          data-testid="ratio"
          ratio={16 / 9}
          render={<section />}
          style={{ color: "red" }}
        />
        <Grid columns={2} gap="sm" render={<section aria-label="grid" />}>
          <GridItem colSpan={2} render={<article />}>
            Grid item
          </GridItem>
        </Grid>
        <Text variant="heading2">Heading</Text>
        <Label render={<span />}>Label text</Label>
      </>,
    );

    const ratio = screen.getByTestId("ratio");
    expect(ratio.tagName).toBe("SECTION");
    // CSSOM may serialize a number as an explicit ratio with denominator 1.
    const [width, height = 1] = ratio.style.aspectRatio.split("/").map(Number);
    expect(width / height).toBeCloseTo(16 / 9);
    expect(ratio.style.color).toBe("red");
    expect(screen.getByRole("region", { name: "grid" })).toHaveAttribute(
      "data-slot",
      "grid",
    );
    expect(screen.getByText("Grid item")).toHaveAttribute(
      "data-slot",
      "grid-item",
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "data-slot",
      "text",
    );
    expect(screen.getByText("Label text").tagName).toBe("SPAN");
  });

  it("renders avatar, badge, and corner-badge state attributes", () => {
    render(
      <AvatarGroup>
        <Avatar size="sm" shape="square">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <CornerBadgeAnchor>
          <Badge variant="success">Online</Badge>
          <CornerBadge dot invisible aria-label="hidden status" />
        </CornerBadgeAnchor>
      </AvatarGroup>,
    );

    expect(screen.getByText("AB")).toHaveAttribute(
      "data-slot",
      "avatar-fallback",
    );
    expect(screen.getByText("Online")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByLabelText("hidden status")).toHaveAttribute(
      "data-invisible",
      "true",
    );
  });

  it("renders breadcrumb semantics and all supporting parts", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(
      screen.getByRole("navigation", { name: "breadcrumb" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/home",
    );
    expect(screen.getByRole("link", { name: "Current" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("More")).toHaveClass("sr-only");
  });

  it("renders card, frame, and empty compositions with every structural slot", () => {
    const { container } = render(
      <>
        <CardFrame>
          <CardFrameHeader>
            <CardFrameTitle>Framed title</CardFrameTitle>
            <CardFrameDescription>Framed description</CardFrameDescription>
          </CardFrameHeader>
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Card description</CardDescription>
              <CardAction>Action</CardAction>
            </CardHeader>
            <CardPanel>Panel</CardPanel>
            <CardFooter>Footer</CardFooter>
          </Card>
          <CardFrameFooter>Framed footer</CardFrameFooter>
        </CardFrame>
        <Frame>
          <FrameHeader>
            <FrameTitle>Frame title</FrameTitle>
            <FrameDescription>Frame description</FrameDescription>
          </FrameHeader>
          <FramePanel>Frame panel</FramePanel>
          <FrameFooter>Frame footer</FrameFooter>
        </Frame>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">Icon</EmptyMedia>
            <EmptyTitle>Nothing here</EmptyTitle>
            <EmptyDescription>No results.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Try again.</EmptyContent>
        </Empty>
      </>,
    );

    for (const slot of [
      "card-frame",
      "card-frame-header",
      "card-frame-title",
      "card-frame-description",
      "card-frame-footer",
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-panel",
      "card-footer",
      "frame",
      "frame-panel-header",
      "frame-panel-title",
      "frame-panel-description",
      "frame-panel",
      "frame-panel-footer",
      "empty",
      "empty-header",
      "empty-media",
      "empty-title",
      "empty-description",
      "empty-content",
    ]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  it("renders form, field, fieldset, and input-group semantics", async () => {
    const user = userEvent.setup();

    render(
      <Form aria-label="profile form">
        <Field invalid>
          <FieldLabel>Name</FieldLabel>
          <FieldItem>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>@</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput aria-label="Username" />
            </InputGroup>
          </FieldItem>
          <FieldDescription>Public username</FieldDescription>
          <FieldError match>Username is required</FieldError>
        </Field>
        <Fieldset>
          <FieldsetLegend>Biography</FieldsetLegend>
          <InputGroup>
            <InputGroupTextarea aria-label="Biography" />
            <InputGroupAddon align="block-end">Footer</InputGroupAddon>
          </InputGroup>
        </Fieldset>
      </Form>,
    );

    const username = screen.getByRole("textbox", { name: "Username" });
    await user.click(screen.getByText("@"));
    expect(username).toHaveFocus();
    expect(screen.getByRole("group", { name: "Biography" })).toHaveAttribute(
      "data-slot",
      "fieldset",
    );
    expect(screen.getByText("Username is required")).toBeVisible();
  });

  it("renders grouped controls, separators, markers, and keyboard hints", () => {
    const { container } = render(
      <>
        <ButtonGroup orientation="vertical">
          <ButtonGroupText>Actions</ButtonGroupText>
          <ButtonGroupSeparator orientation="horizontal" />
        </ButtonGroup>
        <Group orientation="horizontal">
          <GroupText>Group</GroupText>
          <GroupSeparator />
        </Group>
        <Marker size="sm" variant="border">
          <MarkerIcon>*</MarkerIcon>
          <MarkerContent>Marker content</MarkerContent>
        </Marker>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <Separator orientation="vertical" />
        <Skeleton aria-label="loading" />
      </>,
    );

    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(screen.getByText("Marker content")).toHaveAttribute(
      "data-slot",
      "marker-content",
    );
    expect(container.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
    expect(screen.getByLabelText("loading")).toHaveAttribute(
      "data-slot",
      "skeleton",
    );
  });

  it("renders a fully semantic table", () => {
    render(
      <Table>
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>#42</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole("table", { name: "Invoices" });
    expect(table).toHaveAttribute("data-slot", "table");
    expect(
      within(table).getByRole("columnheader", { name: "Number" }),
    ).toBeVisible();
    expect(within(table).getByText("#42")).toHaveAttribute(
      "data-slot",
      "table-cell",
    );
  });

  it("renders toolbar controls and maintains disabled state", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Toolbar aria-label="Editor tools">
        <ToolbarGroup>
          <ToolbarButton onClick={onClick}>Bold</ToolbarButton>
          <ToolbarButton disabled>Italic</ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarInput aria-label="Search tools" />
        <ToolbarLink href="/help">Help</ToolbarLink>
      </Toolbar>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Search tools" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute(
      "href",
      "/help",
    );
  });
});
