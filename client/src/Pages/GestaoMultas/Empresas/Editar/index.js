import React, { useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import useLoadingScreen from "../../../Components/LoadingScreen";
import swal from "sweetalert";
import { getClaims } from "../../../../MicrosoftAuthentication";

import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import "./style.css";
import FormularioEmpresa from "../components/formulario";
import ServiceEmpresas from "src/services/GestaoMultas/ServiceEmpresas";
import { formatDateAtual } from "src/Pages/Utils/formatDate";

function EmpresasEditar() {
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const { id } = useParams();

	const formik = useFormik({
		initialValues: {
			id: id,
			nome: "",
			token: "",
		},
		onSubmit: async (values) => {
			setLoading(true);
			try {
				const { data } = await ServiceEmpresas.update(id, {
					...values,
					cod_user: String(getClaims().name),
				});
				swal("Sucesso!", `A empresa ${data.id} foi atualizada!`, "success");
				await carregarEmpresa();
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});
	async function handleCloseWindow(e, askPermission = true) {
		if (e) {
			e.preventDefault();
		}
		let ok = true;
		if (askPermission) {
			ok = await swal(
				"Ops!",
				"Tem certeza que deseja fechar esta página?",
				"warning",
				{
					buttons: ["Cancelar", { text: "Sim", value: true }],
					dangerMode: true,
				}
			);
		}
		if (ok) {
			window.open("", "_self").close();
		}
	}

	async function carregarEmpresa() {
		try {
			const carga = (await ServiceEmpresas.index(id)).data;
			for (let i in carga) {
				let nonNullValue = carga[i] === null ? "" : carga[i];
				if (i.indexOf("created_at") !== -1 || i.indexOf("updated_at") !== -1) {
					formik.setFieldValue(i, formatDateAtual(nonNullValue));
				} else {
					formik.setFieldValue(i, nonNullValue);
				}
			}
		} catch (error) {
			console.log(error);
			history.push("");
		}
	}
	useEffect(() => {
		let isMounted = true;
		setLoading(true);

		carregarEmpresa().finally(() => {
			if (isMounted) {
				setLoading(false);
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<LoadingScreen />
			<Menusuperior />
			<Container className="mb-5 mt-5">
				<p id="style-title-editorCarga">Editar Empresa</p>
				<hr />
				<Form onSubmit={formik.handleSubmit}>
					<FormularioEmpresa formik={formik}></FormularioEmpresa>
					<div className="class-group-button">
						<Button
							variant="success"
							type="submit"
							className="p-2  botao-gravar"
							disabled={[3, 5, 6].includes(formik.values.fk_situacao)}
						>
							Gravar
						</Button>

						<Button
							variant="warning"
							className="p-2"
							onClick={handleCloseWindow}
						>
							Fechar edição
						</Button>
					</div>
				</Form>
			</Container>
		</>
	);
}

export default EmpresasEditar;
