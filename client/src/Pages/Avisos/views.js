import React from "react";
import "./avisos.css";
import { Row, Col } from "react-bootstrap";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const ViewsAviso = ({ isAvisos }) => {
	const subtitle = (autor, dataCadastro) => (
		<div>
			<h6>Autor: {autor}</h6>
			<h6>Data do cadastro: {dataCadastro}</h6>
		</div>
	);

	return (
		<>
			<div className="row-views-container">
				<Row>
					<Col>
						{isAvisos?.length > 0 && (
							<>
								{isAvisos?.map((item) => {
									return (
										<div key={item.id}>
											<Card
												title={item?.titulo}
												subTitle={subtitle(item.autor, item.data_cadastro)}
												className="mt-2 mb-2"
											>
												<p>{item.mensagem}</p>
											</Card>
										</div>
									);
								})}
							</>
						)}
					</Col>
				</Row>
				<Row className="views-row-buttons">
					<Col className="text-end">
						<Button
							label="Adicionar"
							icon="pi pi-check"
							className="views-button p-button-success p-button-outlined "
						/>

						<Button
							label="Editar"
							icon="pi pi-bookmark"
							className="views-button p-button-secondary p-button-outlined "
						/>
						<Button
							label="Apagar"
							icon="pi pi-times"
							className="views-button p-button-danger p-button-outlined "
						/>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default ViewsAviso;
