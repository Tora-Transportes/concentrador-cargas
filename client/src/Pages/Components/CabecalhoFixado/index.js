import React from "react";
import NavbarNavigator from "src/Pages/Components/NavbarNavigator";

function CabecalhoFixado({ children }) {
	return (
		<>
			<NavbarNavigator className="fixed-top" />
			<h1
				className="fixed-top mb-5 mt-5 pt-2 pb-2 bg-white text-center border-bottom"
				style={{ zIndex: "20" }}
			>
				{children}
			</h1>
			<div className="mt-5 mb-5 pt-5 pb-5" />
		</>
	);
}

export default CabecalhoFixado;
