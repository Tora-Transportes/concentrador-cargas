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
import { Form, InputGroup } from "react-bootstrap";
import { Chip } from "@material-ui/core";
import { MdDone } from "react-icons/md";
import swal from "sweetalert";

const GrupoParametroSchema = Yup.object().shape({
	bloco: Yup.string().required("bloco é um campo obrigatório"),
	observacao: Yup.string().required("observacao é um campo obrigatório"),
});

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
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
}));

function getSteps() {
	return [
		"Bloco a ser reprocessado",
		"Parametrização",
		"Validação e Execução do Reprocessamento",
	];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return `Nessa etapa você selecionará o bloco a ser reprocessado`;
		case 1:
			return "Essa é a etapa de parametrização do reprocessamento";
		case 2:
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

	async function listaBlocos() {
		return ServicePPOCalculador.blocos();
	}

	const validation = ["bloco", "observacao"];

	useEffect(() => {
		Promise.all([listaBlocos()]).then(function (values) {
			setBlocos(values[0].data.data);
		});
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
		},
		validationSchema: GrupoParametroSchema,
		onSubmit: async (values) => {
			const blocoSplit = values.bloco.split("/");
			values.mes = blocoSplit[0];
			values.ano = blocoSplit[1];
			delete values.bloco;
			setLoading(true);
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
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		} else {
			setActiveStep(activeStep);
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
			>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
						<StepContent>
							<Typography>{getStepContent(index)}</Typography>
							<Form>
								{activeStep == 0 && index == 0 ? (
									<Form.Group
										className="mb-3"
										controlId="exampleForm.ControlInput0"
									>
										<Form.Label>Bloco:</Form.Label>
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
								) : (
									<></>
								)}
								{activeStep == 1 && index == 1 ? (
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
								) : (
									<></>
								)}
							</Form>
							{activeStep == 2 && index == 2 ? (
								<div className={classes.chips}>
									<Chip
										className={classes.chip}
										label="BLOCO"
										clickable
										color="primary"
										onDelete={() => {}}
										variant="outlined"
										deleteIcon={<MdDone />}
									/>
									<Chip
										className={classes.chip}
										label="OBSERVAÇÃO"
										onDelete={() => {}}
										color="primary"
										variant="outlined"
										deleteIcon={<MdDone />}
									/>
								</div>
							) : (
								<></>
							)}
							<div className={classes.actionsContainer}>
								<div>
									<Button
										disabled={activeStep === 0}
										onClick={handleBack}
										className={classes.button}
									>
										Voltar
									</Button>
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
