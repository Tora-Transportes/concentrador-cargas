import React, { useContext, useEffect, useRef, useState } from "react";
import "../Avisos/avisos.css";
import { Row, Col, Form } from "react-bootstrap";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { getClaims } from "src/MicrosoftAuthentication";
import { Toast } from "primereact/toast";

import ServiceAvisos from "src/services/ServiceAvisos";
import { Input } from "reactstrap";
import { ContextUseDefault } from "./../../hooks/context/contextPagCargaCTE";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";

let emptyNotice = {
	ID: null,
	TITULO: "",
	MENSAGEM: "",
	AUTOR: "",
};

const ViewsAviso = ({ dadosAvisos, setAtualizarAvisos }) => {
	const [userInformation, setuserInformation] = useState({});
	const [isPermissionAviso, setPermissionAviso] = useState(false);
	const [avisoDialog, setAvisoDialog] = useState(false);
	const [deleteAviso, setDeleteAviso] = useState(false);
	const [likeAviso, setLikeAviso] = useState(0);
	const [dislikeAviso, setDislikeAviso] = useState(0);
	const [likeActive, setLikeActive] = useState(false);
	const [dislikeActive, setDislikeActive] = useState(false);

	const [aviso, setAviso] = useState(emptyNotice);
	const [submittedAviso, setSubmittedAviso] = useState(false);
	const [titleAviso, setTitleAviso] = useState();
	const toast = useRef(null);

	const subtitle = (autor, dataCadastro) => (
		<div className="div-resp-cad-aviso">
			<h6>Responsável pelo Cadastro: {autor}</h6>
			<h6>Data do cadastro: {dataCadastro}</h6>
		</div>
	);

	const openNewNotice = () => {
		emptyNotice.AUTOR = String(getClaims().name);
		setAviso(emptyNotice);
		setSubmittedAviso(false);
		setAvisoDialog(true);
		setTitleAviso("Cadastro de Aviso: ");
	};

	const editNotice = (aviso) => {
		const { TITULO, MENSAGEM } = aviso;
		aviso.TITULO = String(TITULO);
		aviso.MENSAGEM = String(MENSAGEM);
		aviso.AUTOR = String(getClaims().name);

		setAviso({ ...aviso });
		setAvisoDialog(true);
		setTitleAviso("Editar Aviso:");
	};

	const hideNoticeDialog = () => {
		setSubmittedAviso(false);
		setAvisoDialog(false);
	};

	const hideDeleteAviso = () => {
		setDeleteAviso(false);
	};

	const saveNotice = async () => {
		setSubmittedAviso(true);
		if (aviso.MENSAGEM?.length > 15 && aviso.AUTOR) {
			const bodyAviso = {
				TITULO: aviso.TITULO,
				MENSAGEM: aviso.MENSAGEM,
				AUTOR: aviso.AUTOR,
			};

			if (aviso.ID) {
				try {
					await ServiceAvisos.update(aviso.ID, bodyAviso);
					toast.current.show({
						severity: "success",
						summary: "Sucesso!",
						detail: "As informações do aviso foram atualizadas.",
						life: 3000,
					});

					setAtualizarAvisos(true);
				} catch (error) {
					console.error(error);
					setTimeout(() => {
						window.aviso.reload();
					}, 3000);
				}
			} else {
				try {
					await ServiceAvisos.create(bodyAviso);
					toast.current.show({
						severity: "success",
						summary: "Sucesso !",
						detail: "Novo aviso criado com êxito.",
						life: 3000,
					});
					setAtualizarAvisos(true);
				} catch (error) {
					console.error(error);
				}
			}

			setAvisoDialog(false);
			setAviso(emptyNotice);
		} else {
			toast.current.show({
				severity: "info",
				summary: "Atenção!",
				detail: "Mensagem deve conter pelo menos 15 caracteres.",
				life: 3000,
			});
		}
	};

	const confirmDeleteNotice = (aviso) => {
		setAviso(aviso);
		setDeleteAviso(true);
	};

	const excluirAvisos = async () => {
		try {
			const result = await ServiceAvisos.delete(aviso.ID);
			if (result.status === 204) {
				setDeleteAviso(false);
				toast.current.show({
					severity: "info",
					summary: "OPS!",
					detail: "Este aviso não pode ser deletado, tente novamente.",
					life: 3000,
				});
			} else {
				setDeleteAviso(false);
				setAviso(emptyNotice);
				toast.current.show({
					severity: "success",
					summary: "Sucesso",
					detail: "Aviso excluído com sucesso.",
					life: 3000,
				});
				setAtualizarAvisos(true);
			}
		} catch (error) {
			console.error(error);
			setTimeout(() => {
				window.aviso.reload();
			}, 3000);
		}
	};
	const onChangeInput = (e, name) => {
		const valuesField = e.target.value;

		let _avisos = { ...aviso };
		_avisos[`${name}`] = valuesField;

		setAviso(_avisos);
	};

	const deleteAvisoFooter = (
		<div>
			<Button
				label="Voltar"
				icon="pi pi-times"
				className="button-voltar-delete"
				onClick={hideDeleteAviso}
			/>
			<Button
				label="Sim"
				icon="pi pi-check"
				className="button-sim-delete"
				onClick={excluirAvisos}
			/>
		</div>
	);
	const converterData = (dataIso) => {
		const dataTimeJs = new Date(dataIso);
		return dataTimeJs.toLocaleString("pt-BR");
	};
	const { isPermissionUser } = useContext(ContextUseDefault);

	useEffect(() => {
		const user = getClaims().name;
		setuserInformation({ user });
		if (isPermissionUser?.includes("GERENCIAR_AVISOS")) {
			setPermissionAviso(true);
		}
	}, [isPermissionUser]);

	const functionLikeAvisos = async () => {
		if (likeActive) {
			setLikeActive(false);
			setLikeAviso(likeAviso - 1);
		} else {
			setLikeActive(true);
			setLikeAviso(likeAviso + 1);
			if (dislikeActive) {
				setDislikeActive(false);
				setLikeAviso(likeAviso + 1);
				setDislikeAviso(dislikeAviso - 1);
			}
		}
	};

	const functionDislikeAvisos = async () => {
		if (dislikeActive) {
			setDislikeActive(false);
			setDislikeAviso(dislikeAviso - 1);
		} else {
			setDislikeActive(true);
			setDislikeAviso(dislikeAviso + 1);
			if (likeActive) {
				setLikeActive(false);
				setDislikeAviso(dislikeAviso + 1);
				setLikeAviso(likeAviso - 1);
			}
		}
	};

	return (
		<>
			<div>
				<p className="p-saudacao-aviso">
					Olá, <span>{userInformation?.user}</span>!
				</p>
			</div>
			<div className="row-views-container">
				{isPermissionAviso && (
					<Row className="button-add-aviso">
						<Col className="col-button-add">
							<Button
								label="Adicionar um novo aviso"
								icon="pi pi-check"
								className="add-button"
								onClick={openNewNotice}
							/>
						</Col>
					</Row>
				)}
				<Row>
					<Col>
						{dadosAvisos?.length > 0 && (
							<>
								{dadosAvisos?.map((item) => {
									return (
										<div key={item.ID}>
											<Card className="card-avisos">
												{isPermissionAviso && (
													<div className="div-buttons-edit-delete">
														<Button
															label="Editar"
															icon={<BsPencilSquare />}
															className="edit-button"
															onClick={() => editNotice(item)}
														/>
														<Button
															label="Excluir"
															icon="pi pi-trash"
															className="delete-button"
															onClick={() => confirmDeleteNotice(item)}
														/>
													</div>
												)}
												<p className="title-card-avisos">{item?.TITULO}</p>
												<p className="p-mensagem-aviso">{item.MENSAGEM}</p>
												{subtitle(
													item.AUTOR,
													converterData(item.DATA_CADASTRO)
												)}
												<div className="div-reaction-avisos">
													<p className="p-conte-nos-avisos">
														Conte-nos! O que você achou deste aviso?
													</p>
													<div className="buttons-reaction-avisos">
														<Button
															className="button-like-avisos"
															icon={<HiThumbUp className="hi-thumb-Up" />}
															label={likeAviso}
															onClick={functionLikeAvisos}
														/>
														<Button
															className="button-dislike-avisos"
															icon={<HiThumbDown className="hi-thumb-Down" />}
															label={dislikeAviso}
															onClick={functionDislikeAvisos}
														/>
													</div>
												</div>
											</Card>
										</div>
									);
								})}
							</>
						)}
					</Col>
				</Row>
				<Dialog
					visible={avisoDialog}
					style={{ width: "560px", fontSize: "16px" }}
					header={titleAviso}
					modal
					className="p-fluid"
					onHide={hideNoticeDialog}
				>
					<div>
						<label htmlFor="TITULO">Título do Aviso: </label>
						<Input
							id="input-text-title"
							value={aviso.TITULO}
							onChange={(e) => onChangeInput(e, "TITULO")}
							required
							rows={1}
							cols={1}
							autoFocus
							className={classNames({
								"p-invalid": submittedAviso && !aviso.TITULO,
							})}
						/>
						{submittedAviso && !aviso.TITULO && (
							<small className="p-error">Título é um campo obrigatório.</small>
						)}
					</div>

					<div className="div-description">
						<label htmlFor="MENSAGEM">Descrição</label>
						<InputTextarea
							id="input-text-description"
							value={aviso.MENSAGEM}
							onChange={(e) => onChangeInput(e, "MENSAGEM")}
							required
							rows={5}
							cols={40}
							autoFocus
							className={classNames({
								"p-invalid": submittedAviso && !aviso.MENSAGEM,
							})}
						/>
						{submittedAviso && !aviso.MENSAGEM && (
							<small className="p-error">
								Descrição é um campo obrigatório.
							</small>
						)}
					</div>

					<div className="div-resp-cadastro">
						<label> Responsável pelo cadastro:</label>
						<Form.Control
							style={{ width: "300px", border: "none" }}
							className="form-resp-cadastro"
							type="text"
							placeholder={aviso?.AUTOR}
							disabled
						/>
					</div>

					<div className="footer-dialog-editar-avisos">
						<div>
							<Button
								label="Cancelar"
								icon="pi pi-times"
								className="button-cancelar"
								onClick={hideNoticeDialog}
							/>
						</div>
						<div>
							<Button
								label="Salvar"
								icon="pi pi-check"
								className="button-salvar"
								onClick={saveNotice}
							/>
						</div>
					</div>
				</Dialog>
				<Toast ref={toast} />
				<Dialog
					visible={deleteAviso}
					style={{ width: "450px" }}
					header="Deletar Aviso"
					modal
					footer={deleteAvisoFooter}
					onHide={hideDeleteAviso}
				>
					<i
						className="pi pi-exclamation-triangle"
						style={{ fontSize: "2rem", marginLeft: "42%" }}
					/>
					<div className="confirmation-content">
						{aviso && (
							<span className="span-delete">
								Essa ação irá deletar os dados deste aviso permanentemente.
								<b> Deseja continuar?</b>
							</span>
						)}
					</div>
				</Dialog>
			</div>
		</>
	);
};

export default ViewsAviso;
