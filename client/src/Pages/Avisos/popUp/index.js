import React, { useContext, useEffect, useState } from "react";
import io from "../../../services/socket";

import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServiceAvisos from "src/services/ServiceAvisos";
import PopUp from "./view";

function MainPopUp() {
	const [isShow, setShow] = useState(false);
	const [isLastIdPosition, setLastIdPosition] = useState();
	const [isCountAviso, setCountAviso] = useState(1);
	const [isUpdateAviso, setUpdateAviso] = useState(false);

	const { setIdAvisos } = useContext(ContextUseDefault);

	useEffect(() => {
		(async () => {
			const { data } = (await ServiceAvisos.list()).data;
			const dadosStorage = localStorage.getItem("viewsAviso");
			const lastIdPosition = data[0];
			setLastIdPosition(data[0]?.ID);
			setIdAvisos(lastIdPosition?.ID);
			if (dadosStorage === null || dadosStorage < lastIdPosition?.ID) {
				setShow(true);
			}
		})();

		const actionAvisoCreate = (payload) => {
			setShow(true);
			setLastIdPosition(payload?.ID);
		};
		const actionAvidoUpdate = () => {
			setShow(true);
			setUpdateAviso(true);
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
				isUpdateAviso={isUpdateAviso}
				setUpdateAviso={setUpdateAviso}
			/>
		</>
	);
}

export default MainPopUp;
