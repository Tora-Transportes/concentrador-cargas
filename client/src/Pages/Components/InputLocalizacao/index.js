import React, { useState, useRef } from "react";
import _ from "lodash";
import ServiceRecomendacoes from "../../../services/ServiceRecomendacoes";
import AutocompleteInput from "../../Components/AutocompleteInput";

function InputLocalizacao({ keyDataList, onChange, ...props }) {
	const [recomendacoes, setRecomendacoes] = useState([]);

	const throttledAutocompleteLocais = useRef(
		_.throttle((query, callback) => {
			ServiceRecomendacoes.locais({ query }).then(({ data }) => {
				callback(data.data);
			});
		}, 1000)
	);

	function handleChange(event) {
		const { value } = event.target;
		throttledAutocompleteLocais.current(value, setRecomendacoes);
		if (typeof onChange === "function") {
			onChange(event);
		}
	}

	return (
		<AutocompleteInput
			keyDataList={keyDataList}
			options={recomendacoes.map(
				(i) => `${i.pais}/${i.sigla_estado}/${i.cidade}`
			)}
			onChange={handleChange}
			{...props}
		/>
	);
}

export default InputLocalizacao;
