import React, { useState } from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";

const Tooltip = ({ title, text }) => {
  const [show, setShow] = useState(false);

  const handleIconClick = () => {
    setIsOpen(!isOpen);
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>{text}</Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]} // Add 'focus' trigger
      placement="right"
      overlay={popover}
    >
      <i className="la-lg la la-info-circle mx-4"></i>
    </OverlayTrigger>
  );
};

export default Tooltip;
