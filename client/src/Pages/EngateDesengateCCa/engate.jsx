import React, { useState } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ErrorMessage, Formik, Form as FormFormik } from "formik";
import Swal from "sweetalert2";

import Menusuperior from "../Components/MenuSuperior/menusuperior";
import { alertSwal, validations } from "./management";

export default function Engate() {
  const [isViewsOptionsCarreta, setViewsOptionsCarreta] = useState(false);
  const [isViewsOptionsBitrem, setViewsOptionsBitrem] = useState(false);

  const initialValues = {
    placa_cavalo: "",
    placa_carreta: "",
    placa_bitrem: "",
    desengate_Carreta: "",
    desengate_bitrem: "",
    filial: "",
    status: "automático",
  };
  const handleSubmit = async (values) => {
    if (values.desengate_Carreta || values.desengate_bitrem) {
      const text = "Tem certeza que deseja fazer o Engate?";
      const buttonName = "Engatar";
      return await alertSwal(text, buttonName);
    }
    return await Swal.fire({
      title: "Oops...",
      text: "“Selecione uma das opções do engate”.",
    });
  };

  const obsEventoCheckBox = (event, checkbox) => {
    if (checkbox === "checkBoxCarreta") {
      setViewsOptionsCarreta(event);
    } else if (checkbox === "checkBoxBitrem") {
      setViewsOptionsBitrem(event);
    }
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
                  <Row className="row-main-desengate">
                    <Col>
                      <InputGroup className="col-cavalo-desengate">
                        <InputGroup.Text>Cavalo</InputGroup.Text>
                        <Form.Control
                          placeholder="Placa cavalo"
                          type="text"
                          value={values.placa_cavalo.toUpperCase()}
                          onChange={handleChange}
                          name="placa_cavalo"
                        />
                      </InputGroup>
                      <ErrorMessage
                        component="span"
                        name="placa_cavalo"
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
                          value={values.placa_carreta || ""}
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
                          value={values.placa_bitrem || ""}
                        />
                      </InputGroup>
                    </Col>

                    <Col className="checkbox-desengate">
                      <Col className="col-cleckbox-um">
                        <Form.Group className="mt-2">
                          <Form.Check
                            type="checkbox"
                            label="*Engate Carreta"
                            name="desengate_Carreta"
                            value={values.desengate_Carreta || ""}
                            onChange={handleChange}
                            onClick={(e) =>
                              obsEventoCheckBox(
                                e.target.checked,
                                "checkBoxCarreta"
                              )
                            }
                            checked={values.desengate_Carreta}
                            inline
                          />
                          <Form.Check
                            type="checkbox"
                            label="*Engate Bitrem"
                            name="desengate_bitrem"
                            value={values.desengate_bitrem || ""}
                            onChange={handleChange}
                            onClick={(e) =>
                              obsEventoCheckBox(
                                e.target.checked,
                                "checkBoxBitrem"
                              )
                            }
                            checked={values.desengate_bitrem}
                            inline
                          />
                        </Form.Group>
                      </Col>
                    </Col>
                  </Row>

                  <br />
                  {isViewsOptionsCarreta && (
                    <h1>views Carreta onde sera implementado os inputs</h1>
                  )}
                  {isViewsOptionsBitrem && (
                    <h1>views Bitrem onde sera implementado os inputs</h1>
                  )}
                  <br />
                  <Col>
                    <Button
                      type="submit"
                      className="button-submit-desengate"
                      label="Desengatar"
                    />
                  </Col>
                </Card>
              </Fieldset>
            </FormFormik>
          );
        }}
      </Formik>
    </>
  );
}
