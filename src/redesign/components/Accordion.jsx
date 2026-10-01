import { useState } from "react";
import { Icon } from "./Icon";

/** Single accordion row with its own open state (grid-rows 0fr→1fr animation in CSS). */
export function AccordionItem({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`acc__item${open ? " open" : ""}`}>
      <button className="acc__head" onClick={() => setOpen((o) => !o)}>
        {title}
        <span className="acc__ico">
          <Icon name="plus" size={18} />
        </span>
      </button>
      <div className="acc__body">
        <div className="acc__inner">{children}</div>
      </div>
    </div>
  );
}
