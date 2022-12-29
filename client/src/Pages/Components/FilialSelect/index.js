import React, { useEffect, useState } from "react";
//import { Form } from "react-bootstrap";
import ServiceFiliais from "../../../services/ServiceFiliais";
import "../../Cargas/Manual/Cadastrar/cadastroManual.css";

function FilialSelect(props) {
	const [filiais, setFiliais] = useState([]);
	useEffect(() => {
		(async function () {
			const ordenacaoFilial = (await ServiceFiliais.list()).data.data;
			ordenacaoFilial.sort(function (a, b) {
				return a.FIL_COD < b.FIL_COD ? -1 : a.FIL_COD > b.FIL_COD ? 1 : 0;
			});
			setFiliais(ordenacaoFilial);
		})();
	}, []);
	return (
		// <Form.Select {...props}>
		// 	<option></option>
		// 	{filiais.map((i) => (
		// 		<option key={i.FIL_COD} value={i.FIL_COD}>
		// 			{i.FIL_DSC} - {i.FIL_COD}
		// 		</option>
		// 	))}
		// </Form.Select>
		<>
			<input id="filiaisDataList" list="listOfFiliais" {...props}></input>
			<datalist id="listOfFiliais">
				{filiais &&
					filiais.length > 0 &&
					filiais.map((i) => {
						const infoOfFiliais = `${i.FIL_COD} - ${i.FIL_DSC}`;
						return <option key={i.FIL_COD} value={infoOfFiliais}></option>;
					})}
			</datalist>
		</>
	);
}

export default FilialSelect;
