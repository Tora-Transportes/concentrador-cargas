import moment from "moment";

export const calculateDiffDate = async (
  date_inicio: string,
  date_fim: string
) => {
  const dateInicio = moment(date_inicio);
  const dateFim = moment(date_fim);
  const diff = moment(dateFim).diff(moment(dateInicio));
  return moment.duration(diff).asDays();
};
