import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./index.css";
function StatusTooltip({
	placement = "right",
	color = "#000000",
	hint = "",
	...props
}) {
	return (
		<OverlayTrigger
			placement={placement}
			overlay={hint ? <Tooltip>{hint}</Tooltip> : <span></span>}
		>
			<div
				{...props}
				className="circle"
				style={{ backgroundColor: color }}
			></div>
		</OverlayTrigger>
	);
}

export default StatusTooltip;
