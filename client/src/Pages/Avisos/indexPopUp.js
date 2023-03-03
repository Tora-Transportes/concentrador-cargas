import React, { useContext, useEffect, useState } from "react";
import PopUp from "./viewPopUp";

import { ContextUseDefault } from "src/hooks/context/contextPagCargaCTE";
import ServiceAvisos from "src/services/ServiceAvisos";

function MainPopUp() {
	const [isShow, setShow] = useState(false);

	const { setIdAvisos } = useContext(ContextUseDefault);

	useEffect(() => {
		(async () => {
			const { data } = (await ServiceAvisos.list()).data;

			const dadosStorage = localStorage.getItem("viewsAviso");
			const lastIdPosition = data[0];
			setIdAvisos(lastIdPosition?.ID);
			if (dadosStorage === null || dadosStorage < lastIdPosition.ID) {
				setShow(true);
			}
		})();
	}, []);

	return (
		<>
			<PopUp isShow={isShow} setShow={setShow} />
		</>
	);
}

export default MainPopUp;
