import React, { useCallback, useReducer, useRef, useState } from "react";
import Menusuperior from "../../Components/MenuSuperior/menusuperior";
import useLoadingScreen from "../../Components/LoadingScreen";
import ViewEmpresas from "./components/view";
import factoryReducerCargas from "../../../hooks/storageCargas/factoryReducerCargas";
import ServiceEmpresas from "../../../services/GestaoMultas/ServiceEmpresas";
import { Toast } from "primereact/toast";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getClaims } from "src/MicrosoftAuthentication";
import swal from "sweetalert";

const GrupoSchema = Yup.object().shape({
	nome: Yup.string().required("nome é um campo obrigatório"),
	token: Yup.string().required("token é um campo obrigatório"),
});

const Empresas = () => {
	const defaultCargas = {
		page: 1,
		total_pages: 1,
		results: [],
	};
	const cargasReducer = useCallback(factoryReducerCargas(defaultCargas), []);
	const toast = useRef(null);
	const [cargas, dispatchCargas] = useReducer(cargasReducer, defaultCargas);
	const [open, setOpen] = useState(false);
	const [modalShowExcel, setModalShowExcel] = useState(false);
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [itensPerPage, setItensPerPage] = useState(10);
	const [totalRegisters, setTotalRegisters] = useState(0);
	const [lastOptions, setLastOptions] = useState({});

	function resetView() {
		localStorage.removeItem("table-columns");
		location.reload();
	}

	function handleOpen() {
		setOpen(!open);
	}

	const formik = useFormik({
		initialValues: {
			nome: "",
			token: "",
			cod_user: "",
		},
		validationSchema: GrupoSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				formik.values.cod_user = String(getClaims().name);
				await ServiceEmpresas.create(values);
				swal("Sucesso", "Empresa criada!", "success");
				handleOpen();
				formik.resetForm();
				await load();
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		},
	});

	async function load() {
		setLoading(true);
		try {
			const { column, direction } = lastOptions.orderBy ?? {};
			const { data } = await ServiceEmpresas.list({
				...lastOptions.filters,
				page: lastOptions.page,
				order_column: column,
				order_direction: direction,
			});
			setTotalRegisters(data.total_registers);
			dispatchCargas({
				type: "SET",
				payload: { ...data, current_page: data.page },
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	const tableFetchData = useCallback(
		async function (options) {
			setLoading(true);
			try {
				if (options !== lastOptions) {
					setLastOptions(options);
				}
				const { column, direction } = options.orderBy ?? {};
				const { data } = await ServiceEmpresas.list({
					...options.filters,
					page: options.page,
					order_column: column,
					order_direction: direction,
				});
				setLoading(false);
				setTotalRegisters(data.total_registers);
				dispatchCargas({
					type: "SET",
					payload: { ...data, current_page: data.page },
				});
			} catch (error) {
				setLoading(false);
			}
		},
		[setLoading, dispatchCargas]
	);

	return (
		<div>
			<Menusuperior />
			<LoadingScreen />
			<Toast ref={toast} className="w-25" position="top-center"></Toast>
			<Modal show={open} onHide={handleOpen}>
				<Modal.Header closeButton>
					<Modal.Title>Adicionar Empresa</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="validationFormikNomeEdit">
							<Form.Label>Nome Empresa</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="Nome"
									aria-describedby="inputGroupPrepend"
									name="nome"
									value={formik.values.nome}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.nome}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.nome}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
						<Form.Group className="mb-3" controlId="validationFormikTokenEdit">
							<Form.Label>Token</Form.Label>
							<InputGroup hasValidation>
								<Form.Control
									type="text"
									placeholder="token"
									aria-describedby="inputGroupPrepend"
									name="token"
									value={formik.values.token}
									onChange={formik.handleChange}
									isInvalid={!!formik.errors.token}
								/>
								<Form.Control.Feedback type="invalid">
									{formik.errors.token}
								</Form.Control.Feedback>
							</InputGroup>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleOpen}>
						Fechar
					</Button>
					<Button variant="primary" onClick={formik.submitForm}>
						Salvar
					</Button>
				</Modal.Footer>
			</Modal>
			<ViewEmpresas
				handleOpen={handleOpen}
				get_data={tableFetchData}
				data={cargas}
				itensPerPage={itensPerPage}
				setItensPerPage={setItensPerPage}
				totalRegisters={totalRegisters}
				modalShowExcel={modalShowExcel}
				setModalShowExcel={setModalShowExcel}
				resetView={resetView}
			/>
		</div>
	);
};

export default Empresas;
