import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@material-ui/core";
import { MdExpandMore } from "react-icons/md";
import { Form } from "react-bootstrap";

const formatarValorBR = (valor) => {
  if (!valor) return "";
  const num = valor.toString().replace(/[^\d]/g, "");
  const float = (parseFloat(num) / 100).toFixed(2);
  return "R$ " + float.replace(".", ",");
};

const parseValorBR = (valorStr) => {
  if (!valorStr) return 0;
  const limpo = valorStr
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(limpo) || 0;
};

const PPOAccordion = ({ formik }) => {
  const handleValorChange = (e, index) => {
    const raw = e.target.value;
    const somenteNumeros = raw.replace(/\D/g, "");
    const valorFormatado = formatarValorBR(somenteNumeros);
    formik.setFieldValue(`valores[${index}].valor`, valorFormatado);
  };

  const total = formik.values.valores.reduce((acc, linha) => {
    return acc + parseValorBR(linha.valor);
  }, 0);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<MdExpandMore />}>
        <Typography variant="h5">Seção de Parâmetros</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {formik.values.valores.map((linha, index) => (
            <Grid container spacing={1} key={index} alignItems="center">
              <Grid item xs={4}>
                <Typography style={{ paddingLeft: 16 }}>
                  {linha.item}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Form.Group controlId={`referencia-${index}`} className="mb-2">
                  <Form.Label>Referência</Form.Label>
                  <Form.Control
                    type="text"
                    name={`valores[${index}].referencia`}
                    value={linha.referencia}
                    onChange={(e) => {
                      const val = e.target.value;

                      if (index === 0) {
                        // Só letras e até 1 caractere
                        if (/^[a-zA-Z]?$/.test(val)) {
                          formik.setFieldValue(
                            `valores[${index}].referencia`,
                            val.toUpperCase()
                          );
                        }
                      } else {
                        // Só números
                        if (/^\d*$/.test(val)) {
                          formik.setFieldValue(
                            `valores[${index}].referencia`,
                            val
                          );
                        }
                      }
                    }}
                    isInvalid={
                      !!(
                        formik.touched.valores?.[index]?.referencia &&
                        formik.errors.valores?.[index]?.referencia
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.valores?.[index]?.referencia}
                  </Form.Control.Feedback>
                </Form.Group>
              </Grid>
              <Grid item xs={4}>
                <Form.Group controlId={`valor-${index}`} className="mb-2">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="text"
                    name={`valores[${index}].valor`}
                    value={linha.valor}
                    onChange={(e) => handleValorChange(e, index)}
                    isInvalid={
                      !!(
                        formik.touched.valores?.[index]?.valor &&
                        formik.errors.valores?.[index]?.valor
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.valores?.[index]?.valor}
                  </Form.Control.Feedback>
                </Form.Group>
              </Grid>
            </Grid>
          ))}

          {/* Linha do Total */}
          <Grid
            container
            spacing={1}
            alignItems="center"
            style={{ marginTop: 5 }}
          >
            <Grid item xs={8}>
              <Typography style={{ paddingLeft: 16, fontWeight: "bold" }}>
                TOTAL
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Form.Group className="mb-2">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  value={formatarValorBR((total * 100).toFixed(0))} // força precisão
                  readOnly
                />
              </Form.Group>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PPOAccordion;
