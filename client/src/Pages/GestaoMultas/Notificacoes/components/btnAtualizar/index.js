import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaSyncAlt } from "react-icons/fa";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const BtnRefresh = ({
	textoHeader,
	callback,
	params,
	texto,
	titulo = true,
	multiButton = <></>,
}) => {
	const [isRotating, setIsRotating] = useState(false);

	const isMobile = useMediaQuery("(max-width:800px)");

	async function callbackFuction() {
		setIsRotating(true);
		await callback(params);
		setIsRotating(false);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: isMobile ? "column" : "row",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			{titulo ? (
				<p id="style-title-editorCarga">{textoHeader}</p>
			) : (
				<div style={{ marginBottom: "20px" }}>
					<h4>{textoHeader}</h4>
				</div>
			)}

			<div
				style={{
					display: "flex",
					flexDirection: isMobile ? "column" : "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				{multiButton}
				<Button
					variant="outline-primary"
					onClick={callbackFuction}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						marginBottom: titulo ? "0px" : "20px",
					}}
				>
					<FaSyncAlt
						size={20}
						style={{
							transition: "transform 0.5s ease-in-out",
							transform: isRotating ? "rotate(360deg)" : "rotate(0deg)",
						}}
					/>
					{texto}
				</Button>
			</div>
		</div>
	);
};

export default BtnRefresh;
