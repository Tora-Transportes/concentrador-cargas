import React, { useContext, useEffect, useState } from "react";

import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServiceAvisos from "src/services/ServiceAvisos";
import PopUp from "./view";

function MainPopUp() {
	const [isShow, setShow] = useState(false);
	const [isLastIdPosition, setLastIdPosition] = useState();

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
	}, []);

	return (
		<>
			<PopUp
				isShow={isShow}
				setShow={setShow}
				isLastIdPosition={isLastIdPosition}
			/>
		</>
	);
}

export default MainPopUp;
