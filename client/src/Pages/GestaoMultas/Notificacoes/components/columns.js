import React from "react";
import { BsInfoCircle, BsPencilSquare } from "react-icons/bs";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import { FaFileDownload } from "react-icons/fa";
import Chip from "@material-ui/core/Chip";

export const getColumns = () => {
	const columnsRelatorio = [
		{
			name: "editar",
			description: "Editar",
			static_column: true,
			selector: (row) => (
				<Button
					style={{ backgroundColor: "transparent", borderColor: "transparent" }}
					onClick={() => {
						window.open(`/gestao-multas/notificacoes/${row.ait}`, "_blank");
					}}
				>
					<BsPencilSquare style={{ color: "#00652E" }} size={18} />
				</Button>
			),
		},
		{
			name: "status_interno",
			description: "Status Interno",
			selector: (row) => (
				<>
					<Chip
						label={
							row.status_interno ? row.status_interno.status : "INDEFINIDO"
						}
						color="primary"
					></Chip>
				</>
			),
			Filter: (props) => (
				<Form.Select {...props}>
					<option></option>
					<option value="CADASTRADO"> CADASTRADO </option>
					<option value="MOTORISTA IDENTIFICADO">MOTORISTA IDENTIFICADO</option>
					<option value="AGUARDANDO ASSINATURA">AGUARDANDO ASSINATURA</option>
					<option value="TERMO DE IDENTIFICAÇÃO ASSINADO">
						TERMO DE IDENTIFICAÇÃO ASSINADO
					</option>
					<option value="TERMO DE DESCONTO ASSINADO">
						TERMO DE DESCONTO ASSINADO
					</option>
					<option value="DESC LANÇADO SIT">DESC LANÇADO SIT</option>
					<option value="DESC LANÇADO FOLHA">DESC LANÇADO FOLHA</option>
					<option value="AG BOLETO">AG BOLETO</option>
					<option value="AG GERAR FINANCEIRO">AG GERAR FINANCEIRO</option>
					<option value="CONCLUÍDO">CONCLUÍDO</option>
					<option value="RECORRIDO">RECORRIDO</option>
					<option value="RESPONS EMPRESA">RESPONS EMPRESA</option>
					<option value="VINCULADO NIC">VINCULADO NIC</option>
					<option value="ANULADO">ANULADO</option>
				</Form.Select>
			),
			showFilter: true,
		},
		{
			name: "status_smartec",
			description: "Status Smartec",
			selector: (row) => row.status_smartec.status,
			showFilter: false,
		},
		{
			name: "empresa",
			description: "Empresa",
			selector: (row) => row.empresa.nome,
			showFilter: true,
		},
		{
			name: "placa",
			description: "Placa",
			selector: (row) => row.placa,
			showFilter: true,
		},
		{
			name: "renavam",
			description: "Renavam",
			selector: (row) => row.renavam,
			showFilter: true,
		},
		{
			name: "ait",
			description: "AIT",
			selector: (row) => row.ait,
			showFilter: true,
		},
		{
			name: "ait_originaria",
			description: "AIT Origem",
			selector: (row) => row.ait_originaria,
			showFilter: false,
		},
		{
			name: "data_infracao",
			description: "Data Infração",
			selector: (row) => {
				if (!row.data_infracao) return "Sem Informação";
				const [ano, mes, dia] = row.data_infracao.split("-");
				return `${dia}/${mes}/${ano} - ${row.hora}`;
			},
			showFilter: false,
		},
		{
			name: "local",
			description: "Local",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.local ?? "Sem Informações");
					}}
				>
					<BsInfoCircle className="icon-info" />
					Info
				</Button>
			),
			showFilter: false,
		},
		{
			name: "valor_a_pagar",
			description: "Valor a Pagar",
			selector: (row) =>
				row.valor_a_pagar
					? row.valor_a_pagar.toLocaleString("pt-br", {
							style: "currency",
							currency: "BRL",
					  })
					: "Sem Informação",
			showFilter: false,
		},
		{
			name: "municipio",
			description: "Municipio",
			selector: (row) => row.municipio,
			showFilter: true,
		},
		{
			name: "codigo_municipio",
			description: "Cod. Municipio",
			selector: (row) => row.codigo_municipio,
			showFilter: false,
		},
		{
			name: "uf",
			description: "UF",
			selector: (row) => row.uf,
			showFilter: true,
		},
		{
			name: "descricao",
			description: "Descrição",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.descricao ?? "Sem Informações");
					}}
				>
					<BsInfoCircle className="icon-info" />
					Info
				</Button>
			),
			showFilter: false,
		},
		{
			name: "codigo_infracao",
			description: "Cod. Infração",
			selector: (row) => row.codigo_infracao,
			showFilter: false,
		},
		{
			name: "desdobramento",
			description: "Desdobramento",
			selector: (row) => row.desdobramento,
			showFilter: false,
		},
		{
			name: "pontuacao",
			description: "Pontuação",
			selector: (row) => row.pontuacao,
			showFilter: false,
		},
		{
			name: "codigo_orgao",
			description: "Cod. Orgão",
			selector: (row) => row.codigo_orgao,
			showFilter: false,
		},
		{
			name: "orgao_autuador",
			description: "Orgão Atuador",
			selector: (row) => row.orgao_autuador,
			showFilter: false,
		},
		{
			name: "orgao_pesquisa",
			description: "Orgão Pesquisa",
			selector: (row) => row.orgao_pesquisa ?? "Sem Informação",
			showFilter: false,
		},
		{
			name: "prazo_indicacao",
			description: "Prazo Indicação",
			selector: (row) => {
				if (!row.prazo_indicacao) return "Sem Informação";
				const [ano, mes, dia] = row.prazo_indicacao.split("-");
				return `${dia}/${mes}/${ano}`;
			},
			showFilter: false,
		},
		{
			name: "data_pesquisa",
			description: "Data Pesquisa",
			selector: (row) => {
				if (!row.data_pesquisa) return "Sem Informação";
				const isoDate = row.data_pesquisa.split("T")[0];
				const [ano, mes, dia] = isoDate.split("-");
				return `${dia}/${mes}/${ano}`;
			},
			showFilter: false,
		},
		{
			name: "notificacao",
			description: "Link Notificação",
			selector: (row) =>
				row.notificacao === null ? (
					"SEM LINK"
				) : (
					<>
						<FaFileDownload
							size={26}
							onClick={() => {
								window.open(row.notificacao, "_blank");
							}}
						/>
					</>
				),
			showFilter: false,
		},
		{
			name: "screenshot",
			description: "Link Screenshot",
			selector: (row) =>
				row.screenshot === null ? (
					"SEM LINK"
				) : (
					<>
						<FaFileDownload
							size={26}
							onClick={() => {
								window.open(row.screenshot, "_blank");
							}}
						/>
					</>
				),
			showFilter: false,
		},
		{
			name: "boleto",
			description: "Link Boleto",
			selector: (row) =>
				row.boleto === null ? (
					"SEM LINK"
				) : (
					<>
						<FaFileDownload
							size={26}
							onClick={() => {
								window.open(row.boleto, "_blank");
							}}
						/>
					</>
				),
			showFilter: false,
		},
		{
			name: "nit",
			description: "NIT",
			selector: (row) => row.nit ?? "Sem Informação",
			showFilter: false,
		},
		{
			name: "situacao_boleto",
			description: "Situação Boleto",
			selector: (row) => row.situacao_boleto ?? "Sem Informação",
			showFilter: false,
		},
		{
			name: "descricao_boleto",
			description: "Descrição Boleto",
			selector: (row) => row.descricao_boleto ?? "Sem Informação",
			showFilter: false,
		},
		{
			name: "boleto_valor",
			description: "Valor Boleto",
			selector: (row) =>
				row.boleto_valor
					? row.boleto_valor.toLocaleString("pt-br", {
							style: "currency",
							currency: "BRL",
					  })
					: "Sem Informação",
			showFilter: false,
		},
		{
			name: "linha_digitavel",
			description: "Linha Digitavel",
			selector: (row) => (
				<Button
					variant="outline-primary"
					onClick={(e) => {
						e.preventDefault();
						swal(row.linha_digitavel ?? "Sem Informações");
					}}
				>
					<BsInfoCircle className="icon-info" />
					Info
				</Button>
			),
			showFilter: false,
		},
		{
			name: "boleto_vencimento",
			description: "Vencimento Boleto",
			selector: (row) => {
				if (!row.boleto_vencimento) return "Sem Informação";
				const [ano, mes, dia] = row.boleto_vencimento.split("-");
				return `${dia}/${mes}/${ano}`;
			},
			showFilter: false,
		},
		{
			name: "confirmacao_pagamento",
			description: "Pago",
			selector: (row) => (row.confirmacao_pagamento === true ? "Sim" : "Não"),
			showFilter: false,
		},
		{
			name: "motorista_nome",
			description: "Nome Motorista",
			selector: (row) => row.motorista_nome ?? "Sem Informação",
			showFilter: false,
		},
		{
			name: "motorista_matricula",
			description: "Matricula Motorista",
			selector: (row) => row.motorista_matricula ?? "Sem Informação",
			showFilter: false,
		},
		{
			name: "tipo_notificacao",
			description: "Tipo",
			selector: (row) => (row.tipo_notificacao === 1 ? "SNE" : "Normal"),
			showFilter: false,
		},
	];

	return { columnsRelatorio };
};
