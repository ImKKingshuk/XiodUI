import { AgentSteps } from "xiod-ui/agent-steps";
import { Button } from "xiod-ui/button";
import { Dialog, DialogPopup, DialogTrigger } from "xiod-ui/dialog";
import { useMediaQuery } from "xiod-ui/hooks/use-media-query";

export function Consumer() {
  const wide = useMediaQuery("(min-width: 768px)");
  return (
    <Dialog>
      <DialogTrigger render={<Button>Open</Button>} />
      <DialogPopup>
        <AgentSteps label={wide ? "Wide" : "Narrow"} status="completed" />
      </DialogPopup>
    </Dialog>
  );
}
