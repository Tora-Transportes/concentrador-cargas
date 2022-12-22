import React, { useRef, useEffect } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import "./inputPlaca.css";

function InputPlaca(props) {
	const placaInput = useRef(null);
	useEffect(() => {
		const handleUpperCase = (e) => {
			e.target.value = e.target.value.toUpperCase();
		};
		placaInput.current.addEventListener("keyup", handleUpperCase);
		return () => {
			placaInput.current.removeEventListener("keyup", handleUpperCase);
		};
	}, []);

	return (
		<>
			<InputGroup className="mb-2 flex-nowrap">
				<InputGroup.Text className="input-placaCav">
					Placa Cavalo
				</InputGroup.Text>
				<FormControl
					ref={placaInput}
					placeholder="Placa veículo"
					type="text"
					name="placa_veiculo"
					{...props}
				/>
			</InputGroup>
		</>
	);
}

export default InputPlaca;
