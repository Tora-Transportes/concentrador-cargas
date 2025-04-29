import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { MdExpandMore } from "react-icons/md";

const PPOAccordion = ({ formik }) => {
  const total = formik.values.valores.reduce((acc, linha) => {
    const valor = parseFloat(linha.valor?.replace(",", ".")) || 0;
    return acc + valor;
  }, 0);

  return (
    <Accordion expanded>
      <AccordionSummary expandIcon={<MdExpandMore />}>
        <Typography variant="h5">Seção de Parâmetros</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {formik.values.valores.map((linha, index) => (
            <Grid container spacing={1} key={index} alignItems="center">
              <Grid item xs={4}>
                <Typography pl={2}>{linha.item}</Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ paddingBottom: "5px" }}
                  label="Referência"
                  name={`valores[${index}].referencia`}
                  value={linha.referencia}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.valores?.[index]?.referencia &&
                      formik.errors.valores?.[index]?.referencia
                  )}
                  helperText={
                    formik.touched.valores?.[index]?.referencia &&
                    formik.errors.valores?.[index]?.referencia
                  }
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ paddingBottom: "5px" }}
                  label="Valor"
                  name={`valores[${index}].valor`}
                  value={linha.valor}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.valores?.[index]?.valor &&
                      formik.errors.valores?.[index]?.valor
                  )}
                  helperText={
                    formik.touched.valores?.[index]?.valor &&
                    formik.errors.valores?.[index]?.valor
                  }
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          ))}

          {/* Linha do Total */}
          <Grid container spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <Grid item xs={8}>
              <Typography pl={2} fontWeight="bold">
                TOTAL
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={total.toFixed(2)}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PPOAccordion;
