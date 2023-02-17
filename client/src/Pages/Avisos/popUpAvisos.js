import React from "react";
import { useHistory } from "react-router-dom";
import "./popUp.css";
import imgNotice from "../../assets/notice.png";

function PopUp({ isShow, lastIdPosition }) {
	const history = useHistory();
	const showPageAviso = () => {
		history.push(`/avisos/${lastIdPosition}`);
	};

	return (
		<>
			<div className="container-toast-aviso">
				{isShow && (
					<div className="div-toast-popup">
						<button className="button-toast-popup" onClick={showPageAviso}>
							<img src={imgNotice} width="25" height="25" />
						</button>
						<span className="span-message">Você tem um novo aviso!</span>
					</div>
				)}
			</div>
		</>
	);
}

export default PopUp;
