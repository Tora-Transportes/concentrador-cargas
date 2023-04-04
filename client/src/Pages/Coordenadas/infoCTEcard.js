import React, { useEffect, useState } from "react";
import "./coordenadas.css";
import ServiceCargaCTE from "src/services/ServiceCargaCTE";
import { Col, Row } from "react-bootstrap";
import useLoadingScreen from "../Components/LoadingScreen";
import swal from "sweetalert";
import { Card } from "primereact/card";
import DateUtils from "../Utils/date";

function InfoCTEcard({ rowInfoPlaca, setVisibleCardCte }) {
	const [dataCTE, setDataCTE] = useState([]);
	const [LoadingScreen, setLoading] = useLoadingScreen();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const { data } = await ServiceCargaCTE.search(rowInfoPlaca?.placa);

			if (data.data.results) {
				const arrayDoc_ID = [];
				const arrayPeso_real = [];
				data.data.results.forEach((item) => {
					arrayDoc_ID.push(` ${item.DOC_ID};`);
					arrayPeso_real.push(item.DT_PESO_REAL);
				});
				data.data.results[0].DOC_ID = [...new Set(arrayDoc_ID)];
				data.data.results[0].DT_PESO_REAL = await [...new Set(arrayPeso_real)]
					.reduce((soma, index) => {
						return parseFloat(soma + index);
					})
					.toFixed(2);

				const result = await { ...rowInfoPlaca, ...data.data?.results[0] };
				setDataCTE([result]);
				setLoading(false);
			} else {
				const exitDialog = swal(
					"Ops!",
					"Não existem dados referentes a essa placa no CTE",
					"warning"
				);
				if (exitDialog) setVisibleCardCte(false);

				setLoading(false);
			}
		})();
	}, [rowInfoPlaca]);

	const filterTipoCategoria = (value) => {
		if (!value) return "";
		switch (value) {
			case "A":
				return "Agregado";
			case "F":
				return "Frota";
			case "C":
				return "Carreteiro";
			default:
				return "Não reconhecido";
		}
	};

	return (
		<>
			<LoadingScreen />
			<Row className="w-50">
				<Col>
					<ul>
						{dataCTE?.map((i, index) => (
							<div key={index}>
								<Card title="Documentos CTE">
									<li className="ul-card-li">
										<h6>
											Tipo documento: <strong>{i.TIPO_DOC}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Número CTE: <strong>{i.DOC_ID}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Peso total: <strong>{i.DT_PESO_REAL}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Data de emissão:{" "}
											<strong>
												{DateUtils.formatDateTresHorasMenos(i.DT_HORA_EMISSAO)}
											</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Data de entrega:{" "}
											<strong>
												{DateUtils.formatDateTresHorasMenos(i.DT_ENTREGA)}
											</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Documento cancelado:{" "}
											<strong>
												{i.DT_CANCELAMENTO == null ? "Não" : i.DT_CANCELAMENTO}
											</strong>
										</h6>
									</li>
								</Card>

								<Card title="Documentos e Coordenadas" className="mt-3">
									<li className="ul-card-li">
										<h6>
											Documento: <strong>{i.documento}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Tipo documento: <strong>{i.tipo_documento}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											MCT: <strong>{i.mct}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Posição Atual: <strong>{i.cidade_atual}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Data de cálculo:{" "}
											<strong>{DateUtils.formatDate(i.data_calculo)}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Data de emissão do documento:{" "}
											<strong>
												{
													DateUtils.formatDate(i.data_emissao_documento).split(
														" - "
													)[0]
												}
											</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Data janela:{" "}
											<strong>{DateUtils.formatDate(i.data_janela)}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Previsão Real:{" "}
											<strong>
												{DateUtils.formatDate(i.data_previsao_chegada)}
											</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Distância destino:{" "}
											<strong>{i.distancia_ate_destino}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Distância prevista:{" "}
											<strong>{i.distancia_prevista}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Previsão calculada:{" "}
											<strong>
												{DateUtils.convertDateToReadableTime(
													Number(i.tempo_ate_destino)
												)}
											</strong>
										</h6>
									</li>
								</Card>

								<Card title="Veículo" className="mt-3">
									<li className="ul-card-li">
										<h6>
											Placa: <strong>{i.placa}</strong>
										</h6>
									</li>
									{/* <li className="ul-card-li">
										<h6>
											Placa carreta: <strong>{i.placa_carreta}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Placa bitrem: <strong>{i.placa_bitrem}</strong>
										</h6>
									</li> */}
									<li className="ul-card-li">
										<h6>
											Código veículo: <strong>{i.codigo_veiculo}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Categoria:{" "}
											<strong>
												{filterTipoCategoria(i.categoria_veiculo)}
											</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											RP E-mail: <strong>{i.responsavel_placa_email}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											RP Nome: <strong>{i.responsavel_placa_nome}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Setor veículo: <strong>{i.setor_veiculo}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Tipo carreta: <strong>{i.tipo_carreta}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Apelido carreta: <strong>{i.apelido_carreta}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Tipo cavalo: <strong>{i.tipo_cavalo}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Setor veículo: <strong>{i.setor_veiculo}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Origem última viagem:{" "}
											<strong>{i.ultima_viagem_origem}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Destino última viagem:{" "}
											<strong>{i.ultima_viagem_destino}</strong>
										</h6>
									</li>
								</Card>

								<Card title="Motorista" className="mt-3">
									<li className="ul-card-li">
										<h6>
											Motorista: <strong>{i.nome_motorista}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											Telefone motorista:{" "}
											<strong>{i.telefone_motorista}</strong>
										</h6>
									</li>
									<li className="ul-card-li">
										<h6>
											CPF motorista: <strong>{i.cpf_motorista}</strong>
										</h6>
									</li>
								</Card>
							</div>
						))}
					</ul>
				</Col>
			</Row>
		</>
	);
}

export default InfoCTEcard;
