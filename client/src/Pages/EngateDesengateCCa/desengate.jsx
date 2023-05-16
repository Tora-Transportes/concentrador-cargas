import React from "react";
import { Row, Col } from "react-bootstrap";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { ErrorMessage, Formik, Form as FormFormik } from "formik";
import Swal from "sweetalert2";

import Menusuperior from "../Components/MenuSuperior/menusuperior";
import { Form, InputGroup } from "react-bootstrap";
import { alertSwal, validations } from "./management";

export default function Desengate() {
  const initialValues = {
    placa_cavalo: "",
    placa_carreta: "",
    placa_bitrem: "",
    desengate_carreta: "",
    desengate_bitrem: "",
    filial: "",
    status: "automático",
  };

  const handleSubmit = async (values) => {
    if (values.desengate_carreta || values.desengate_bitrem) {
      const text = "Tem certeza que deseja fazer o desengate?";
      const buttonName = "Desengatar";
      return await alertSwal(text, buttonName);
    }
    return await Swal.fire({
      title: "Oops...",
      text: "“Selecione uma das opções do desengate”.",
    });
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
              <Fieldset
                legend="Processo de Desengate"
                className="fieldSet-title"
              >
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
                        <Checkbox
                          inputId="desengateUm"
                          name="desengate_carreta"
                          value={values.desengate_carreta}
                          onChange={handleChange}
                          checked={values.desengate_carreta}
                          className="me-2"
                        />
                        <label htmlFor="desengateUm" className="me-3">
                          Desengate Carreta
                        </label>

                        <Checkbox
                          inputId="desengateDois"
                          name="desengate_bitrem"
                          value={values.desengate_bitrem}
                          onChange={handleChange}
                          checked={values.desengate_bitrem}
                          className="me-2"
                        />
                        <label htmlFor="desengateDois" className="ml-2">
                          Desengate Bitrem
                        </label>
                      </Col>
                    </Col>
                  </Row>

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
