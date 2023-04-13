import React, { useContext, useEffect, useState } from "react";
import io from "../../../services/socket";

import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServiceAvisos from "src/services/ServiceAvisos";
import PopUp from "./view";

function MainPopUp() {
	const [isShow, setShow] = useState(false);
	const [isLastIdPosition, setLastIdPosition] = useState();
	const [isCountAviso, setCountAviso] = useState(0);
	const idAvisoLocalStorage = localStorage.getItem("viewsAviso");
	const { setIdAvisos } = useContext(ContextUseDefault);

	useEffect(() => {
		(async () => {
			const { data } = (await ServiceAvisos.lastId()).data;
			const lastIdPosition = data?.ID;
			setLastIdPosition(lastIdPosition);
			setIdAvisos(lastIdPosition);
			if (idAvisoLocalStorage < lastIdPosition) {
				idAvisoLocalStorage === null ? setCountAviso("?") : "";
				setShow(true);
			}
		})();

		const actionAvisoCreate = (payload) => {
			setShow(true);
			setLastIdPosition(payload?.ID);
		};
		const actionAvidoUpdate = (payload) => {
			if (payload?.ID - idAvisoLocalStorage < 1) setCountAviso("?");
			setShow(true);
		};
		io.on("@aviso-create", actionAvisoCreate);
		io.on("@aviso-update", actionAvidoUpdate);

		return () => {
			io.off("@aviso-create", actionAvisoCreate);
			io.off("@aviso-update", actionAvidoUpdate);
		};
	}, [io]);

	return (
		<>
			<PopUp
				isShow={isShow}
				setShow={setShow}
				isLastIdPosition={isLastIdPosition}
				setCountAviso={setCountAviso}
				isCountAviso={isCountAviso}
				idAvisoLocalStorage={idAvisoLocalStorage}
			/>
		</>
	);
}

export default MainPopUp;
