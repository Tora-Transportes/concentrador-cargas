import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import "./popUp.css";

function PopUp({ isShow, isLastIdPosition }) {
	const [isCountAviso, setCountAviso] = useState(1);
	const history = useHistory();
	const showPageAviso = () => {
		history.push("/avisos");
	};

	useEffect(() => {
		const idAvisoLocalStorage = localStorage.getItem("viewsAviso");
		let avisosNaoLidos;

		if (idAvisoLocalStorage < 1 && isLastIdPosition > 0) {
			localStorage.setItem("viewsAviso", isLastIdPosition - 1);
		} else if (idAvisoLocalStorage > 0 && isLastIdPosition > 0) {
			avisosNaoLidos = isLastIdPosition - idAvisoLocalStorage;
			if (avisosNaoLidos > 99) avisosNaoLidos = "+99";
			setCountAviso(avisosNaoLidos);
		}
	}, [isLastIdPosition]);

	return (
		<>
			<div className="container-toast-aviso">
				{isShow && window.location.pathname != "/avisos" && (
					<div className="div-toast-popup">
						<div className="popup-redondo">
							<h6 className="popup-redondo-h6">{isCountAviso}</h6>
						</div>
						<div className="popup-imag-envelop">
							<FaEnvelope
								className="popup-icon-envelop"
								onClick={showPageAviso}
								color="#00652e"
								size="35px"
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default PopUp;
