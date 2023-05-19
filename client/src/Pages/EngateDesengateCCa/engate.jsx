import React, { useState } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ErrorMessage, Formik, Form as FormFormik } from "formik";
import { Document, Page, pdfjs } from "react-pdf";
import Swal from "sweetalert2";

import Menusuperior from "../Components/MenuSuperior/menusuperior";
import {
  alertSwal,
  handleSearchVehicle,
  initialValues,
  validations,
} from "./management";

export default function Engate() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [isViewsOptionsengate1, setViewsOptionsengate1] = useState(false);
  const [isViewsOptionsEngate2, setViewsOptionsEngate2] = useState(false);
  const [isFilePdf, setFilePdf] = useState(null);
  const [isInfoPlacaVeiculo, setInfoPlacaVeiculo] = useState({
    placa_carreta: "",
    placa_bitrem: "",
    engate_carreta: "",
    engate_bitrem: "",
  });
  // const [isLoadingButton, setLoadingButton] = useState(false);
  // const [isNameButton, setNameButton] = useState({
  //   name: "Importar Aditivo",
  //   cor: "#00652e",
  // });

  const handleSubmit = async (values) => {
    console.log("Entrou no submit");
    if (isInfoPlacaVeiculo.engate_carreta || isInfoPlacaVeiculo.engate_bitrem) {
      if (
        (isInfoPlacaVeiculo.engate_carreta && values.PLACA_CARRETA_UM === "") ||
        (isInfoPlacaVeiculo.engate_bitrem && values.PLACA_CARRETA_DOIS === "")
      ) {
        return await Swal.fire({
          title: "Oops...",
          text: "“Placa do veiculo é obrigatório.”.",
        });
      }
      const text = "Tem certeza que deseja fazer o Engate?";
      const buttonName = "Engatar";
      const bodyEnviar = {
        file: isFilePdf,
        info: values,
      };
      return await alertSwal(text, buttonName, bodyEnviar);
    }
    return await Swal.fire({
      title: "Oops...",
      text: "“Selecione uma das opções do engate”.",
    });
  };

  const obsEventoCheckBox = (event, checkbox) => {
    if (checkbox === "checkBoxengate1") {
      setViewsOptionsengate1(event);
      setInfoPlacaVeiculo((valoresAtuais) => ({
        ...valoresAtuais,
        engate_carreta: event,
      }));
    } else if (checkbox === "checkBoxEngate2") {
      setViewsOptionsEngate2(event);
      setInfoPlacaVeiculo((valoresAtuais) => ({
        ...valoresAtuais,
        engate_bitrem: event,
      }));
    }
  };

  const exportarAditivoPdf = (e) => {
    //exportarAditivo(setLoadingButton, setNameButton);
    const selectedFile = e.target.files[0];
    setFilePdf(selectedFile);
  };

  return (
    <>
      <Menusuperior />
      {/* <h1 className="h1-title-desengate">Processo de Desengate:</h1> */}
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validations}
      >
        {({ handleChange, values }) => {
          return (
            <FormFormik className="p-col-12  p-lg-12 p-sm-12">
              <Fieldset legend="Processo de Engate">
                <Card>
                  <Card>
                    <Row className="row-main-desengate">
                      <Col>
                        <InputGroup className="col-cavalo-desengate">
                          <InputGroup.Text>Cavalo</InputGroup.Text>
                          <Form.Control
                            placeholder="Placa cavalo"
                            type="text"
                            value={values.PLACA_VEICULO?.toUpperCase() || ""}
                            onChange={handleChange}
                            onBlur={() => {
                              handleSearchVehicle(
                                values.PLACA_VEICULO,

                                setInfoPlacaVeiculo
                              );
                            }}
                            name="PLACA_VEICULO"
                          />
                        </InputGroup>
                        <ErrorMessage
                          component="span"
                          name="PLACA_VEICULO"
                          style={{ color: "red" }}
                        />
                      </Col>
                      <Col sm={12} md={6}>
                        <InputGroup className="input-carreta-desengate">
                          <InputGroup.Text>Carreta</InputGroup.Text>
                          <Form.Control
                            readOnly
                            onChange={handleChange}
                            placeholder="Placa carreta"
                            type="text"
                            value={isInfoPlacaVeiculo.placa_carreta}
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <InputGroup className="input-bitrem mb-2">
                          <InputGroup.Text>Bitrem</InputGroup.Text>
                          <Form.Control
                            readOnly
                            onChange={handleChange}
                            placeholder="Placa bitrem"
                            type="text"
                            value={isInfoPlacaVeiculo.placa_bitrem}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <InputGroup className="input-bitrem mb-2">
                          <InputGroup.Text>Filial</InputGroup.Text>
                          <Form.Control
                            //onChange={handleChange}
                            placeholder="Nome Filial"
                            name="FILIAL"
                            type="text"
                            //value={isInfoPlacaVeiculo.FILIAL}
                          />
                        </InputGroup>
                        <ErrorMessage
                          component="span"
                          name="FILIAL"
                          style={{ color: "red" }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="checkbox-desengate">
                        <Col className="col-cleckbox-um">
                          <Form.Group className="mt-2">
                            <Form.Check
                              type="checkbox"
                              label="*Engate 1"
                              name="engate_carreta"
                              value={isInfoPlacaVeiculo.engate_carreta}
                              // onChange={handleChange}
                              onClick={(e) =>
                                obsEventoCheckBox(
                                  e.target.checked,
                                  "checkBoxengate1"
                                )
                              }
                              checked={isInfoPlacaVeiculo.engate_carreta}
                              inline
                            />
                            <Form.Check
                              type="checkbox"
                              label="*Engate 2"
                              name="engate_bitrem"
                              value={isInfoPlacaVeiculo.engate_bitrem}
                              //onChange={handleChange}
                              onClick={(e) =>
                                obsEventoCheckBox(
                                  e.target.checked,
                                  "checkBoxEngate2"
                                )
                              }
                              checked={isInfoPlacaVeiculo.engate_bitrem}
                              inline
                            />
                          </Form.Group>
                        </Col>
                      </Col>
                    </Row>
                  </Card>
                  <br />
                  {isViewsOptionsengate1 && (
                    <Card className="card-novo-engate">
                      <Row>
                        <Row>
                          <Col lg={6} className="col-novo-placa-carreta">
                            <InputGroup className="col-cavalo-engate">
                              <InputGroup.Text>Engate 1</InputGroup.Text>
                              <Form.Control
                                placeholder="Placa novo engate 1"
                                type="text"
                                value={
                                  values.PLACA_CARRETA_UM?.toUpperCase() || ""
                                }
                                onChange={handleChange}
                                name="PLACA_CARRETA_UM"
                              />
                            </InputGroup>
                            <ErrorMessage
                              component="span"
                              name="PLACA_CARRETA_UM"
                              style={{ color: "red" }}
                            />
                            <Button
                              className="buttons-nova-placa"
                              label="Detalhes engate1"
                              onClick={() => console.log("Clicou no info")}
                            />
                          </Col>
                          <Col lg={6}>
                            <InputGroup className="col-cavalo-status">
                              <InputGroup.Text>Status</InputGroup.Text>
                              <Form.Control
                                placeholder="Status do processo"
                                type="text"
                                value={values.STATUS}
                                onChange={handleChange}
                                name="STATUS"
                              />
                            </InputGroup>
                          </Col>
                        </Row>
                        <Row>
                          {isViewsOptionsEngate2 && (
                            <Col lg={6} className="col-novo-placa-carreta">
                              <InputGroup className="col-cavalo-engate mt-2">
                                <InputGroup.Text>Engate 2</InputGroup.Text>
                                <Form.Control
                                  placeholder="Placa novo engate2"
                                  type="text"
                                  value={
                                    values.PLACA_CARRETA_DOIS?.toUpperCase() ||
                                    ""
                                  }
                                  onChange={handleChange}
                                  name="PLACA_CARRETA_DOIS"
                                />
                              </InputGroup>
                              <ErrorMessage
                                component="span"
                                name="PLACA_CARRETA_DOIS"
                                style={{ color: "red" }}
                              />
                              <Button
                                className="buttons-nova-placa mt-2"
                                label=" Detalhes Engate2"
                                onClick={() => console.log("Clicou no info")}
                              />
                            </Col>
                          )}
                          <Col className="input-pdf">
                            <input
                              type="file"
                              accept=".pdf"
                              className="button-export-aditivo"
                              onChange={exportarAditivoPdf}
                            />
                          </Col>
                        </Row>
                      </Row>
                    </Card>
                  )}
                  <br />
                  <Col>
                    <Button
                      type="submit"
                      className="button-submit-desengate"
                      label="Engatar"
                    />
                  </Col>
                </Card>
                {isFilePdf && (
                  <div className="visualizacao-pdf">
                    <Document file={isFilePdf}>
                      <Page pageNumber={1} wrap={false} />
                    </Document>
                  </div>
                )}
              </Fieldset>
            </FormFormik>
          );
        }}
      </Formik>
    </>
  );
}
