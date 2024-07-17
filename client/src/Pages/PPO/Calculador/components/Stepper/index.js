import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import useLoadingScreen from "../../../../Components/LoadingScreen";
import * as Yup from "yup";
import ServicePPOCalculador from "src/services/PPO/ServicePPOCalculador";
import ServicePPOPermissoesVisualizacao from "src/services/PPO/ServicePPOPermissoesVisualizacao";
import { Form, InputGroup } from "react-bootstrap";
import { Chip } from "@material-ui/core";
import { MdDone } from "react-icons/md";
import swal from "sweetalert";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const GrupoParametroSchema = Yup.object().shape({
	bloco: Yup.string().required("mês/ano é um campo obrigatório"),
	autentique_delete: Yup.boolean().oneOf([true], "Você deve aceitar os termos"),
	observacao: Yup.string().required("observacao é um campo obrigatório"),
	tipo_reprocessamento: Yup.number().required(
		"Tipo Reprocessamento é um campo obrigatório"
	),
	grupos: Yup.array()
		.of(
			Yup.object().shape({
				value: Yup.number(),
				label: Yup.string(),
			})
		)
		.when("tipo_reprocessamento", {
			is: (val) => {
				return val === 2;
			},
			then: (s) =>
				s
					.required("Grupo é um campo obrigatório")
					.min(1, "Grupo é um campo obrigatório"),
			otherwise: (s) => s,
		}),
	cpfs: Yup.array()
		.of(
			Yup.object().shape({
				value: Yup.string(),
				label: Yup.string(),
			})
		)
		.when("tipo_reprocessamento", {
			is: (val) => {
				return val === 3;
			},
			then: (s) =>
				s
					.required("CPF é um campo obrigatório")
					.min(1, "CPF é um campo obrigatório"),
			otherwise: (s) => s,
		}),
});

const tipoReprocessamento = [
	{ key: 1, value: "Todos" },
	{ key: 2, value: "Por Grupo(s)" },
	{ key: 3, value: "CPF(s)" },
];

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
		backgroundColor: "#00652e",
		color: "white",
		"&:hover": {
			backgroundColor: "gray",
		},
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
	stepper: {
		paddingTop: "60px",
	},
	chips: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "left",
		flexWrap: "wrap",
		"& > *": {
			margin: theme.spacing(0.5),
		},
	},
	chip: {
		height: "30px",
		width: "200px",
	},
	stepIcon: {
		"&$active": {
			color: "#00652e",
		},
		"&$completed": {
			color: "#00652e",
		},
		"&$text": {
			color: "black",
		},
	},
	active: {},
	completed: {},
	text: {},
}));

function getSteps() {
	return [
		"Tipo de reprocessamento",
		"Mês/Ano a ser reprocessado",
		"Parametrização",
		"Validação e Execução do Reprocessamento",
	];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return `Nessa etapa você selecionará o tipo do reprocessamento`;
		case 1:
			return `Nessa etapa você selecionará o mês/ano a ser reprocessado`;
		case 2:
			return "Essa é a etapa de parametrização do reprocessamento";
		case 3:
			return `Por fim a validação das informações para criar o reprocessamento`;
		default:
			return "Unknown step";
	}
}

function StepperComponent({ handleReprocessar }) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();
	const [LoadingScreen, setLoading] = useLoadingScreen();
	const [blocos, setBlocos] = useState([]);
	const [grupos, setGrupos] = useState([]);
	const [motoristas, setMotoristas] = useState([]);

	async function listaBlocos() {
		return ServicePPOCalculador.blocos();
	}

	async function listaGrupos() {
		return ServicePPOPermissoesVisualizacao.listAllGrupos();
	}

	async function listaMotoristas() {
		return ServicePPOCalculador.motoristas();
	}

	const validation = ["tipo_reprocessamento", "bloco", "observacao"];

	useEffect(() => {
		Promise.all([listaBlocos(), listaGrupos(), listaMotoristas()]).then(
			function (values) {
				setBlocos(values[0].data.data);
				setGrupos(values[1]);
				setMotoristas(values[2]);
			}
		);
	}, []);

	const formik = useFormik({
		initialValues: {
			tipo: 1,
			status: 0,
			bloco: "",
			mes: "",
			ano: "",
			qtd_processada: 0,
			qtd_final: 0,
			observacao: "",
			tipo_reprocessamento: "1",
			grupos: "",
			cpfs: "",
			autentique_delete: false,
		},
		validationSchema: GrupoParametroSchema,
		onSubmit: async (values) => {
			const blocoSplit = values.bloco.split("/");
			values.mes = blocoSplit[0];
			values.ano = blocoSplit[1];
			delete values.bloco;
			setLoading(true);
			console.log(values);
			try {
				await ServicePPOCalculador.create(values);
				swal(
					"Sucesso!",
					"foi agendado com sucesso o reprocessamento, em instantes irá começar a execução.",
					"success"
				);
				handleReprocessar();
				formik.resetForm();
			} catch (error) {
				console.log(error);
			}
			handleReprocessar();
			setLoading(false);
		},
	});

	const handleNext = async () => {
		const isValid = await formik.validateForm();
		if (isValid[validation[activeStep]] == undefined) {
			if (activeStep == 0 && formik.values.tipo_reprocessamento == 2) {
				if (isValid["grupos"] != undefined) return;
			}
			if (activeStep == 0 && formik.values.tipo_reprocessamento == 3) {
				if (isValid["cpfs"] != undefined) return;
			}
			if (activeStep == 2) {
				if (isValid["autentique_delete"] != undefined) return;
			}
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<div className={classes.root}>
			<LoadingScreen />

			<Stepper
				activeStep={activeStep}
				className={classes.stepper}
				orientation="vertical"
				classes={{
					root: classes.stepper,
				}}
			>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel
							StepIconProps={{
								classes: {
									root: classes.stepIcon,
									active: classes.active,
									completed: classes.completed,
									text: classes.text,
								},
							}}
						>
							{label}
						</StepLabel>
						<StepContent>
							<Typography>{getStepContent(index)}</Typography>
							<Form>
								{activeStep === 0 && index === 0 && (
									<>
										<Form.Group
											className="mb-3"
											controlId="exampleForm.ControlInput0"
										>
											<Form.Label>Tipo Reprocessamento:</Form.Label>
											<Form.Select
												aria-label="Default select example"
												name="tipo_reprocessamento"
												onChange={formik.handleChange}
												value={formik.values.tipo_reprocessamento}
												isInvalid={!!formik.errors.tipo_reprocessamento}
												placeholder="Selecione um tipo"
											>
												<option></option>
												{tipoReprocessamento.map((objeto, index) => (
													<option key={index} value={`${objeto.key}`}>
														{`${objeto.value}`}
													</option>
												))}
											</Form.Select>
											<Form.Control.Feedback type="invalid">
												{formik.errors.tipo_reprocessamento}
											</Form.Control.Feedback>
										</Form.Group>
										{formik.values.tipo_reprocessamento == 2 ? (
											<Form.Group
												className="mb-3"
												controlId="validationFormikGrupos"
											>
												<Form.Label>{"Grupo(s)"}</Form.Label>
												<Select
													id="grupos"
													name="grupos"
													isMulti
													placeholder="Selecionar Grupos"
													options={grupos}
													isLoading={grupos.length == 0 ? true : false}
													components={animatedComponents}
													onChange={(option) =>
														formik.setFieldValue("grupos", option)
													}
													value={formik.values.grupos}
												/>
												{formik.errors.grupos && (
													<div style={{ color: "red" }}>
														{formik.errors.grupos}
													</div>
												)}
											</Form.Group>
										) : (
											<></>
										)}
										{formik.values.tipo_reprocessamento == 3 ? (
											<Form.Group
												className="mb-3"
												controlId="validationFormikCpfs"
											>
												<Form.Label>{"CPF(s)"}</Form.Label>
												<Select
													id="cpfs"
													name="cpfs"
													isMulti
													placeholder="Selecionar Grupos"
													options={motoristas}
													isLoading={motoristas.length == 0 ? true : false}
													components={animatedComponents}
													onChange={(option) =>
														formik.setFieldValue("cpfs", option)
													}
													value={formik.values.cpfs}
												/>
												{formik.errors.cpfs && (
													<div style={{ color: "red" }}>
														{formik.errors.cpfs}
													</div>
												)}
											</Form.Group>
										) : (
											<></>
										)}
									</>
								)}
								{activeStep === 1 && index === 1 && (
									<Form.Group
										className="mb-3"
										controlId="exampleForm.ControlInput1"
									>
										<Form.Label>Mês/Ano:</Form.Label>
										<Form.Select
											aria-label="Default select example"
											name="bloco"
											onChange={formik.handleChange}
											value={formik.values.bloco}
											isInvalid={!!formik.errors.bloco}
											placeholder="Selecione um parâmetro"
										>
											<option></option>
											{blocos.map((objeto, index) => (
												<option
													key={index}
													value={`${objeto.mes_avaliacao}/${objeto.ano_avaliacao}`}
												>
													{`${objeto.mes_avaliacao}/${objeto.ano_avaliacao}`}
												</option>
											))}
										</Form.Select>
										<Form.Control.Feedback type="invalid">
											{formik.errors.bloco}
										</Form.Control.Feedback>
									</Form.Group>
								)}
								{activeStep === 2 && index === 2 && (
									<>
										<Form.Group
											className="mb-3"
											controlId="validationFormikNomeEdit"
										>
											<Form.Label>Observação</Form.Label>
											<InputGroup hasValidation>
												<Form.Control
													type="text"
													placeholder="Observação"
													aria-describedby="inputGroupPrepend"
													name="observacao"
													value={formik.values.observacao}
													onChange={formik.handleChange}
													isInvalid={!!formik.errors.observacao}
												/>
												<Form.Control.Feedback type="invalid">
													{formik.errors.observacao}
												</Form.Control.Feedback>
											</InputGroup>
										</Form.Group>

										<Form.Group
											className="mb-3"
											controlId="validationFormikObservacao"
										>
											<Form.Label>
												Deletar demonstrativos já gerados na Auntentique?
											</Form.Label>
											<InputGroup hasValidation>
												<Form.Check
													type="checkbox"
													id="autentique_delete"
													label="Autentique Delete"
													aria-describedby="inputGroupPrepend"
													name="autentique_delete"
													checked={formik.values.autentique_delete}
													onChange={formik.handleChange}
													isInvalid={!!formik.errors.autentique_delete}
													feedback={formik.errors.autentique_delete}
												/>
												<Form.Control.Feedback type="invalid">
													{formik.errors.autentique_delete}
												</Form.Control.Feedback>
											</InputGroup>
										</Form.Group>
									</>
								)}
							</Form>
							{activeStep === 3 && index === 3 && (
								<div className={classes.chips}>
									<Chip
										className={classes.chip}
										label="Tipo Reprocessamento"
										clickable
										color="primary"
										onDelete={() => {}}
										variant="outlined"
										deleteIcon={<MdDone />}
									/>
									<Chip
										className={classes.chip}
										label="Mês/Ano"
										onDelete={() => {}}
										color="primary"
										variant="outlined"
										deleteIcon={<MdDone />}
									/>
									<Chip
										className={classes.chip}
										label="Parametrização"
										onDelete={() => {}}
										color="primary"
										variant="outlined"
										deleteIcon={<MdDone />}
									/>
								</div>
							)}
							<div className={classes.actionsContainer}>
								<div>
									{activeStep != 0 ? (
										<Button
											disabled={activeStep === 0}
											onClick={handleBack}
											className={classes.button}
										>
											Voltar
										</Button>
									) : (
										<></>
									)}
									<Button
										variant="contained"
										color="primary"
										onClick={
											activeStep === steps.length - 1
												? formik.handleSubmit
												: handleNext
										}
										className={classes.button}
									>
										{activeStep === steps.length - 1 ? "Processar" : "Próximo"}
									</Button>
								</div>
							</div>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Paper square elevation={0} className={classes.resetContainer}>
					<Typography>All steps completed - you&apos;re finished</Typography>
					<Button onClick={handleReset} className={classes.button}>
						Reset
					</Button>
				</Paper>
			)}
		</div>
	);
}

export default StepperComponent;
