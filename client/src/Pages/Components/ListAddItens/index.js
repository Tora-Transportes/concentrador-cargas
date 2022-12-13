import React, { useState, useEffect, useRef } from "react";
import "./listAddItens.css";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import { Dialog } from "primereact/dialog";
import { calcularDistancia } from "src/Pages/Utils/calcularDistanciaKM";
import { DetalhesDialogParadas } from "./dialog";

export default function ListAddItens({ onChange, value, name, formik }) {
	const [list, setList] = useState([]);
	const [visibleDialog, setVisibleDialog] = useState(false);
	const [ultimaParadaIntermediaria, setUltimaParadaIntermediaria] =
		useState("");
	const coutRef = useRef(0);

	async function addItem(
		{ parada_intemediaria },
		{ peso, numeroCte, servico }
	) {
		if (
			(formik.values.origem_carga && parada_intemediaria) ||
			(ultimaParadaIntermediaria && parada_intemediaria)
		) {
			const origem_carga =
				coutRef.current === 0
					? formik.values.origem_carga
					: ultimaParadaIntermediaria;

			const distanciaKm = await calcularDistancia(
				origem_carga,
				parada_intemediaria
			);

			coutRef.current++;
			setUltimaParadaIntermediaria(parada_intemediaria);

			if (distanciaKm) {
				const dadosParada = `Cidade: ${parada_intemediaria}; DISTÂNCIA: ${distanciaKm} km; PESO: ${peso}; SERVIÇO: ${servico}; DOC tRANSPORTE: ${numeroCte}.`;
				setList([...new Set([...list, dadosParada])]);
			} else {
				const dadosParada = `CIDADE: ${parada_intemediaria}, PESO: ${peso}, SERVIÇO: ${servico}, DOC tRANSPORTE: ${numeroCte}.`;
				setList([...new Set([...list, dadosParada])]);
			}
		} else if (formik.values.origem_carga.length < 3) {
			await swal(
				"Ops!",
				"Antes de adicionar uma parada preencha o campo *Origem da carga.",
				"warning"
			);
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
				"Ops!",
				"Você tem certeza que deseja excluir a parada selecionada?",
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

	async function viwsInputLocalizacao() {
		await formik.setFieldValue("parada_intemediaria", "");
		setVisibleDialog(true);
	}

	return (
		<ol>
			<>
				{list?.map((i, index) => (
					<li key={i.split("-")[0] + index} className="lista-map">
						<Button
							id="style-add-parada"
							className="m-1 ml-5 w-100 text-start"
							onClick={() => removeItem(i)}
						>
							{i}
						</Button>
					</li>
				))}

				<Dialog
					className="dialog-parada"
					header={"Registre as informações do serviço e local:"}
					visible={visibleDialog}
					onHide={() => setVisibleDialog(false)}
					closable={true}
				>
					<DetalhesDialogParadas
						setVisibleDialog={setVisibleDialog}
						formik={formik}
						addItem={addItem}
					/>
				</Dialog>

				<Button id="style-botao-add" onClick={viwsInputLocalizacao}>
					Adicionar Parada
				</Button>
			</>
		</ol>
	);
}
