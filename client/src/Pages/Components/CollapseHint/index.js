import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function CollapseHint({ text, length = 30 }) {
	return (
		<OverlayTrigger
			placement="left"
			overlay={text ? <Tooltip>{text}</Tooltip> : <span />}
		>
			<div>{text?.substr(0, length)}</div>
		</OverlayTrigger>
	);
}

export default CollapseHint;
