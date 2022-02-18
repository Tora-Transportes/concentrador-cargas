import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function CollapseHint({ text, length = 30, onClick }) {
	return (
		<OverlayTrigger
			placement="left"
			overlay={text ? <Tooltip>{text}</Tooltip> : <span />}
		>
			<div onClick={onClick}>
				{text?.substr(0, length)}
				{text?.length > length ? "..." : ""}
			</div>
		</OverlayTrigger>
	);
}

export default CollapseHint;
