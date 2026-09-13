import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import "./test.css";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../../src/components/accordion";
import { Button } from "../../src/components/button";
import { Checkbox } from "../../src/components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/dialog";
import {
  InputPayment,
  InputPaymentBrandIcon,
  InputPaymentCardNumber,
  InputPaymentCVC,
  InputPaymentExpiry,
  InputPaymentGroup,
  InputPaymentMethodSelector,
  InputPaymentZip,
} from "../../src/components/input-payment";
import { InputPhone } from "../../src/components/input-phone";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "../../src/components/menu";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";
import { Switch } from "../../src/components/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../../src/components/tabs";

function InteractionHarness(): React.JSX.Element {
  const [clicks, setClicks] = useState(0);
  const [menuAction, setMenuAction] = useState("none");
  const [framework, setFramework] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 bg-background p-8 text-foreground">
      <h1 className="font-semibold text-2xl">XiodUI interaction harness</h1>

      <section aria-labelledby="actions-heading" className="flex gap-4">
        <h2 className="sr-only" id="actions-heading">
          Actions
        </h2>
        <Button onClick={() => setClicks((count) => count + 1)}>
          Increment
        </Button>
        <output aria-label="click count">{clicks}</output>
      </section>

      <section
        aria-labelledby="controls-heading"
        className="flex items-center gap-6"
      >
        <h2 className="sr-only" id="controls-heading">
          Controls
        </h2>
        <div className="flex items-center gap-2">
          <Checkbox id="accept-terms" />
          <label htmlFor="accept-terms">Accept terms</label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="enable-notifications" />
          <label htmlFor="enable-notifications">Enable notifications</label>
        </div>
      </section>

      <Accordion className="max-w-md">
        <AccordionItem value="shipping">
          <AccordionTrigger>How fast is shipping?</AccordionTrigger>
          <AccordionPanel>Shipping takes two business days.</AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Tabs defaultValue="account">
        <TabsList aria-label="Profile sections">
          <TabsTab value="account">Account</TabsTab>
          <TabsTab value="security">Security</TabsTab>
        </TabsList>
        <TabsPanel value="account">Account settings</TabsPanel>
        <TabsPanel value="security">Security settings</TabsPanel>
      </Tabs>

      <section aria-labelledby="popup-heading" className="flex flex-wrap gap-4">
        <h2 className="sr-only" id="popup-heading">
          Popup controls
        </h2>
        <Menu>
          <MenuTrigger render={<Button variant="outline">Actions</Button>} />
          <MenuPopup>
            <MenuItem onClick={() => setMenuAction("renamed")}>Rename</MenuItem>
            <MenuItem disabled>Unavailable</MenuItem>
          </MenuPopup>
        </Menu>
        <output aria-label="menu action">{menuAction}</output>

        <Select onValueChange={(value) => setFramework(String(value))}>
          <SelectTrigger aria-label="Framework">
            <SelectValue placeholder="Choose a framework" />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectPopup>
        </Select>
        <output aria-label="selected framework">{framework || "none"}</output>
      </section>

      <section
        aria-labelledby="specialized-inputs-heading"
        className="grid gap-4"
      >
        <h2 className="font-medium" id="specialized-inputs-heading">
          Specialized inputs
        </h2>
        <InputPhone onChange={(value) => setPhone(value)} />
        <output aria-label="international phone">{phone || "empty"}</output>
        <InputPayment>
          <InputPaymentMethodSelector />
          <InputPaymentGroup>
            <InputPaymentBrandIcon />
            <InputPaymentCardNumber />
            <InputPaymentExpiry />
            <InputPaymentCVC />
            <InputPaymentZip />
          </InputPaymentGroup>
        </InputPayment>
      </section>

      <Dialog>
        <DialogTrigger render={<Button>Open profile dialog</Button>} />
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update the public information on your profile.
            </DialogDescription>
          </DialogHeader>
          <DialogPanel>
            <label className="flex flex-col gap-2">
              Display name
              <input
                aria-label="Display name"
                className="rounded-md border border-input bg-background p-2"
                defaultValue="Margaret Welsh"
              />
            </label>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Save profile</Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </main>
  );
}

const root = document.querySelector("#root");

if (!root) throw new Error("Missing browser test root");

const reactRoot = createRoot(root);

reactRoot.render(
  <StrictMode>
    <InteractionHarness />
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => reactRoot.unmount());
}
