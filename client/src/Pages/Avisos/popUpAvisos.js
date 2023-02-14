import React from "react";
import { useHistory } from "react-router-dom";
import "./popUp.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

function PopUp({ isShow, setShow, lastIdPosition }) {
	const history = useHistory();
	const showPageAviso = () => {
		history.push(`/avisos/${lastIdPosition}`);
	};

	return (
		<>
			<div className="container-toast-aviso">
				{isShow && (
					<div className="div-toast-avisos">
						<AiOutlineCloseCircle
							id="button-close-message"
							onClick={() => setShow(false)}
						>
							x
						</AiOutlineCloseCircle>
						<span className="span-message">Você tem um novo aviso!</span>

						<button className="button-toast-aviso" onClick={showPageAviso}>
							Ver agora
						</button>
					</div>
				)}
			</div>
		</>
	);
}

export default PopUp;
