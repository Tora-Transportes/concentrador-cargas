import React, { useEffect, useState } from "react";
import ServiceCsnCargas from "src/services/ServiceCsnCargas";

function RotasSelect(props) {
	const [rota, setRotas] = useState([]);
	useEffect(() => {
		(async function () {
			const ordenacaoFilial = (await ServiceCsnCargas.list()).data.data;
			console.log("AAAAAAAA", ordenacaoFilial);
			// ordenacaoFilial.sort(function (a, b) {
			// 	return a.FIL_COD < b.FIL_COD ? -1 : a.FIL_COD > b.FIL_COD ? 1 : 0;
			// });
			setRotas(ordenacaoFilial);
		})();
	}, []);
	return (
		<>
			<input id="rotaDataList" list="listOfRotas" {...props}></input>
			<datalist id="listOfRotas">
				{rota.results &&
					rota.results.length > 0 &&
					rota.results.map((i) => {
						const infoOfFiliais = `${i.ID} - ${i.OBSERVACAO}`;
						return (
							<option key={i.ID} value={infoOfFiliais}>
								{i.OBSERVACAO}
							</option>
						);
					})}
			</datalist>
		</>
	);
}

export default RotasSelect;
