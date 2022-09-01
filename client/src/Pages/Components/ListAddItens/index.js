import React, { useState, useEffect } from "react";
import "../ListAddItens/style.css";
import { Button } from "react-bootstrap";
import swal from "sweetalert";

export default function ListAddItens({ onChange, value, name }) {
	const [list, setList] = useState([]);
	async function addItem() {
		const item = await swal("Adicionando parada", {
			content: "input",
		});
		if (item) {
			setList([...new Set([...list, item])]);
		}
	}

	useEffect(() => {
		if (Array.isArray(value)) {
			setList(value);
		}
	}, [value]);

	useEffect(() => {
		if (onChange && typeof onChange === "function") {
			onChange({
				target: {
					name: name,
					value: list,
				},
			});
		}
	}, [list]);

	async function removeItem(key) {
		if (
			await swal(
				"Ops",
				"Certeza que deseja excluir a parada selecionada ?",
				"warning",
				{
					buttons: ["Cancelar", "Excluir"],
					dangerMode: true,
				}
			)
		) {
			setList(list.filter((i) => i !== key));
		}
	}

	return (
		<ol className="border list-unstyled">
			{list?.map((i, index) => (
				<li key={i + index}>
					<Button
						className="m-1 ml-5 w-100 text-start fw-bold"
						variant="outline-danger"
						onClick={() => removeItem(i)}
					>
						{i}
					</Button>
				</li>
			))}

			<Button
				id="style-botao-add"
				className="class-button-add"
				onClick={addItem}
			>
				Adicionar
			</Button>
		</ol>
	);
}
