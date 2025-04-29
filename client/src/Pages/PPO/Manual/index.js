import React, { useEffect, useState } from "react";
import {
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Typography,
	TextField,
	makeStyles,
	Paper,
} from "@material-ui/core";

import useLoadingScreen from "src/Pages/Components/LoadingScreen";
import Menusuperior from "src/Pages/Components/MenuSuperior/menusuperior";
import { Form, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import ServicePPOGruposMotoristas from "src/services/PPO/ServicePPOGruposMotoristas";
import Select from "react-select";
import { endOfMonth, format, parse, startOfMonth, subMonths } from "date-fns";
import Swal2 from "sweetalert2";
import PPOAccordion from "./_components/PPOAccordion";
import ServicePPO from "src/services/PPO/ServicePPO";
import ServicePPORastreabilidade from "src/services/PPO/ServicePPORastreabilidade";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		padding: theme.spacing(3),
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginTop: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
	stepper: {
		paddingTop: "30px",
	},
}));

const PpoManualStepper = () => {
	const classes = useStyles();
	const [LoadingScreen, setLoading] = useLoadingScreen();

	const [activeStep, setActiveStep] = useState(0);
	const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
	const [forceLoad, setForceLoad] = useState(false);
	const [motoristasAtivosSelect, setMotoristasAtivosSelect] = useState([]);
	const [motoristasAtivos, setMotoristasAtivos] = useState([]);
	const currentDate = new Date();
	const currentMonth = format(currentDate, "MM/yyyy");
	const previousMonth = format(subMonths(currentDate, 1), "MM/yyyy");
	const options = [
		{ value: previousMonth, label: previousMonth },
		{ value: currentMonth, label: currentMonth },
	];
	const [periodSelected, setPeriodSelected] = React.useState(options[1]);

	async function forceLoading() {
		setForceLoad(!forceLoad);
	}

	const MotoristaSchema = Yup.object().shape({
		item: Yup.object()
			.shape({
				value: Yup.string().required("Motorista é um campo obrigatório"),
				label: Yup.string().required("Motorista é um campo obrigatório"),
			})
			.required("Motorista é campo obrigatórios"),
		motivo: Yup.string().required("motivo é um campo obrigatório"),
		valores: Yup.array().of(
			Yup.object({
				referencia: Yup.string().required("Obrigatório"),
				valor: Yup.string().required("Obrigatório"),
			})
		),
	});

	function normalizarValores(valores) {
		return valores.map((item) => ({
			...item,
			valor: item.valor
				.replace("R$", "") // remove prefixo
				.replace(/\./g, "") // remove pontos de milhar
				.replace(",", ".") // troca vírgula por ponto decimal
				.trim(),
		}));
	}

	const formik = useFormik({
		initialValues: {
			motorista: {},
			motivo: "",
			mes: "",
			ano: "",
			valores: [
				{ item: "AVALIAÇÃO", referencia: "", valor: "" },
				{ item: "INFRAÇÃO DE INTERJORNADA", referencia: "", valor: "" },
				{ item: "INFRAÇÃO VELOCIDADE", referencia: "", valor: "" },
				{ item: "KM", referencia: "", valor: "" },
			],
		},
		validationSchema: MotoristaSchema,
		onSubmit: async (values) => {
			const { mes, ano } = getMonthAndYearFromSelectedOption(periodSelected);
			values.mes = mes;
			values.ano = ano;
			const payload = values;
			payload.valores = normalizarValores(payload.valores);

			setLoading(true);
			const ppoCalculed = await existPpoCalculed();

			if (ppoCalculed) {
				setLoading(false);
				return;
			}

			try {
				await ServicePPORastreabilidade.create(payload);
				Swal2.fire({
					icon: "success",
					title: "Sucesso!",
					text: `PPO Manual criado com sucesso!`,
				});
			} catch (error) {
				Swal2.fire({
					icon: "error",
					title: "Oops...",
					text: `Erro ao criar PPO Manual!`,
				});
			}
			setLoading(false);
			handleReset();
		},
	});

	async function listaMotoristasAtivos() {
		return ServicePPOGruposMotoristas.motoristasAtivos();
	}

	useEffect(() => {
		setLoading(true);
		setMotoristaSelecionado(null);
		setMotoristasAtivosSelect([]);
		setMotoristasAtivos([]);
		Promise.all([listaMotoristasAtivos()]).then(function (values) {
			const motoristasAtivos = [];
			values[0].data.data.map((mot) => {
				motoristasAtivos.push({
					value: mot.cpf,
					label: `${mot.nome} - ${mot.matricula} - ${mot.cpf}`,
				});
			});
			setMotoristasAtivosSelect(motoristasAtivos);
			setMotoristasAtivos(values[0].data.data);
		});
		setLoading(false);
	}, [forceLoad]);

	const handleCpfChange = (option) => {
		formik.setFieldValue("item", option);
		const motoristaFiltrado = motoristasAtivos.filter(
			(motorista) => motorista.cpf === option.value
		);
		formik.setFieldValue("motorista", motoristaFiltrado[0]);
		setMotoristaSelecionado(motoristaFiltrado[0]);
	};

	const handleNext = () => {
		setActiveStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	const handleReset = () => {
		formik.resetForm();
		forceLoading();
		setActiveStep(0);
	};

	const handleSubmit = async () => {
		formik.submitForm();
		//handleNext();
	};

	function getDateRangeFromSelectedOption(periodSelected) {
		const parsedDate = parse(periodSelected.value, "MM/yyyy", new Date());

		const inicio = startOfMonth(parsedDate);
		const fim = endOfMonth(parsedDate);

		return {
			date_inicio: format(inicio, "yyyy-MM-dd"),
			date_fim: format(fim, "yyyy-MM-dd"),
		};
	}

	function getMonthAndYearFromSelectedOption(periodSelected) {
		const parsedDate = parse(periodSelected.value, "MM/yyyy", new Date());
		return {
			mes: String(parsedDate.getMonth() + 1).padStart(2, "0"),
			ano: parsedDate.getFullYear(),
		};
	}

	async function existPpoCalculed() {
		const { mes, ano } = getMonthAndYearFromSelectedOption(periodSelected);
		const data = await ServicePPO.demonstrativos({
			cpf: motoristaSelecionado.cpf,
			ano_avaliacao: ano,
			mes_avaliacao: mes,
			permissoes: "'TODAS','HISTORICO'",
			app_erro: true,
		});

		if (data.data.data.length > 0) {
			Swal2.fire({
				icon: "warning",
				title: "Oops...",
				text: `Já existe um cálculo prévio para o motorista ${motoristaSelecionado.nome} | ${motoristaSelecionado.cpf} do périodo : ${periodSelected.value}. Para efetuar a inclusão do PPO Manual é necessário remover o cálculo existe! `,
			});
			return true;
		} else {
			return false;
		}
	}

	async function findStatisticsForDriver() {
		const { date_inicio, date_fim } =
			getDateRangeFromSelectedOption(periodSelected);

		const [avaliacoes, distancia, infracoes, interjornadas] = await Promise.all(
			[
				ServicePPO.avaliacoes(motoristaSelecionado.cpf, date_inicio, date_fim),
				ServicePPO.distancia(motoristaSelecionado.cpf, date_inicio, date_fim),
				ServicePPO.infracoes(motoristaSelecionado.cpf, date_inicio, date_fim),
				ServicePPO.interjornadas(
					motoristaSelecionado.cpf,
					date_inicio,
					date_fim
				),
			]
		);

		formik.setFieldValue(
			"valores",
			(formik.values.valores || []).map((valor) => {
				switch (valor.item) {
					case "AVALIAÇÃO":
						return {
							...valor,
							referencia: avaliacoes?.data?.data?.[0]?.pontuacao || "N/A",
						};
					case "INFRAÇÃO DE INTERJORNADA":
						return {
							...valor,
							referencia:
								interjornadas?.data?.data?.length?.toString() || "N/A",
						};
					case "INFRAÇÃO VELOCIDADE":
						return {
							...valor,
							referencia: infracoes?.data?.data?.length?.toString() || "N/A",
						};
					case "KM":
						return {
							...valor,
							referencia:
								distancia?.data?.data?.[0]?.distancia.replace("KM", "") ||
								"N/A",
						};
					default:
						return valor;
				}
			})
		);
	}

	const handleValidationDriver = async () => {
		setLoading(true);
		let ppoCalculed = false;
		if (
			!["SEM MOVIMENTO", "FUNCIONARIO EM SITUACAO NORMAL"].includes(
				motoristaSelecionado.status
			)
		) {
			setLoading(false);
			await Swal2.fire({
				icon: "warning",
				title: "Oops...",
				text: "Motorista não se enquadra em uma situação válida",
			});
			return;
		}

		if (activeStep == 1) {
			//TODO: validar se já existe um ppo gerado para o motorista no mês solicitado, caso o cara queira colocar o ppo manual ele tem que cancelar o previamente gerado

			await formik.validateField("motivo");
			const motivoErro = formik.errors.motivo;
			await formik.setFieldTouched("motivo");

			if (!formik.values.motivo || motivoErro) {
				setLoading(false);
				await Swal2.fire({
					icon: "warning",
					title: "Atenção",
					text: "É obrigatório preencher o motivo!",
				});
				return;
			}

			ppoCalculed = await existPpoCalculed();

			if (!ppoCalculed) {
				await findStatisticsForDriver();
			} else {
				setLoading(false);
				return;
			}
		}
		setLoading(false);
		handleNext();
	};

	return (
		<>
			{/* Fora da div root */}
			<LoadingScreen />
			<Menusuperior />

			{/* Dentro da div root */}
			<div className={classes.root}>
				<Typography variant="h4" gutterBottom>
					PPO Manual
				</Typography>

				<Stepper
					activeStep={activeStep}
					orientation="vertical"
					className={classes.stepper}
				>
					{/* Etapa 1 */}
					<Step>
						<StepLabel>Buscar Motorista</StepLabel>
						<StepContent>
							<Typography>Digite o CPF do motorista:</Typography>
							<Form>
								<Form.Group
									className="mb-3"
									controlId="validationFormikUsuario"
								>
									<Form.Label>Motorista</Form.Label>
									<Select
										id="item"
										name="item"
										placeholder="Selecionar Usuário"
										options={motoristasAtivosSelect}
										onChange={(option) => handleCpfChange(option)}
										value={formik.values.item}
									/>
									{formik.errors.item && formik.touched.item && (
										<div style={{ color: "red" }}>{formik.errors.item}</div>
									)}
								</Form.Group>
							</Form>
							{motoristaSelecionado && (
								<Typography color="primary">
									Motorista encontrado: {motoristaSelecionado.nome}
								</Typography>
							)}
							<div className={classes.actionsContainer}>
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
									onClick={handleValidationDriver}
									className={classes.button}
									disabled={!motoristaSelecionado}
								>
									Próximo
								</Button>
							</div>
						</StepContent>
					</Step>

					{/* Etapa 2 */}
					<Step>
						<StepLabel>Dados e Mês</StepLabel>
						<StepContent>
							{motoristaSelecionado ? (
								<>
									<TextField
										label="Nome do Motorista"
										value={motoristaSelecionado.nome}
										InputProps={{ readOnly: true }}
										fullWidth
										margin="normal"
									/>
									<TextField
										label="CPF"
										value={motoristaSelecionado.cpf}
										InputProps={{ readOnly: true }}
										fullWidth
										margin="normal"
									/>
									<TextField
										label="Filial"
										value={motoristaSelecionado.filial}
										InputProps={{ readOnly: true }}
										fullWidth
										margin="normal"
									/>

									<TextField
										label="Situação Funcionário"
										value={motoristaSelecionado.status}
										InputProps={{ readOnly: true }}
										fullWidth
										margin="normal"
									/>

									<Form>
										<Form.Group
											className="mb-3"
											controlId="validationFormikUsuario"
										>
											<Form.Label>Mês de cálculo</Form.Label>
											<Select
												options={options}
												value={periodSelected}
												onChange={(option) => setPeriodSelected(option)}
												placeholder="Selecione um mês"
											/>
											{formik.errors.item && formik.touched.item && (
												<div style={{ color: "red" }}>{formik.errors.item}</div>
											)}
										</Form.Group>

										<Form.Group
											className="mb-3"
											controlId="validationFormikPremio"
										>
											<Form.Label>Motivo</Form.Label>
											<InputGroup hasValidation>
												<Form.Control
													type="text"
													placeholder="Motivo Inclusão Manual"
													aria-describedby="inputGroupPrepend"
													name="motivo"
													value={formik.values.motivo}
													onChange={formik.handleChange}
													isInvalid={
														!!formik.errors.motivo && formik.touched.motivo
													}
												/>
											</InputGroup>
											<div style={{ minHeight: "20px" }}>
												{formik.errors.motivo && formik.touched.motivo && (
													<div style={{ color: "red", fontSize: "0.875rem" }}>
														{formik.errors.motivo}
													</div>
												)}
											</div>
										</Form.Group>
									</Form>
								</>
							) : (
								<Typography color="error">
									Nenhum motorista selecionado.
								</Typography>
							)}
							<div className={classes.actionsContainer}>
								<Button onClick={handleBack} className={classes.button}>
									Voltar
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={handleValidationDriver}
									className={classes.button}
									disabled={!periodSelected}
								>
									Próximo
								</Button>
							</div>
						</StepContent>
					</Step>

					{/* Etapa 3 */}
					<Step>
						<StepLabel>Parâmetros</StepLabel>
						<StepContent>
							<PPOAccordion formik={formik} />
							<div className={classes.actionsContainer}>
								<Button onClick={handleBack} className={classes.button}>
									Voltar
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit}
									className={classes.button}
								>
									Processar
								</Button>
							</div>
						</StepContent>
					</Step>
				</Stepper>

				{activeStep === 3 && (
					<Paper square elevation={0} className={classes.resetContainer}>
						<Typography variant="h6">Processo concluído!</Typography>
						<Button onClick={handleReset} className={classes.button}>
							Reiniciar
						</Button>
					</Paper>
				)}
			</div>
		</>
	);
};

export default PpoManualStepper;
