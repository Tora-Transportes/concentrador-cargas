import React from "react";
import { useHistory } from "react-router-dom";
import "./popUp.css";
import imgNotice from "../../assets/notice.png";

function PopUp({ isShow }) {
	const history = useHistory();
	const showPageAviso = () => {
		history.push("/avisos");
	};

	return (
		<>
			<div className="container-toast-aviso">
				{isShow && (
					<div className="div-toast-popup">
						<button className="button-toast-popup" onClick={showPageAviso}>
							<img src={imgNotice} width="35" height="35" />
						</button>
						<span className="span-message">Você tem um novo aviso!</span>
					</div>
				)}
			</div>
		</>
	);
}

export default PopUp;
