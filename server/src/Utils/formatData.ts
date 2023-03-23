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

export const formatDateString = (dataValues: Date | null | undefined) => {
  if (dataValues) {
    const data = new Date(dataValues);
    const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
    return data2.toISOString().replace(/\.\d{3}Z$/, "");
  }
};
export const formatDateObject = (dataValues: Date | null | undefined) => {
  if (dataValues) {
    const dateFormate = new Date(dataValues);
    dateFormate.setHours(dateFormate.getHours() + 1);
    return dateFormate;
  }
};

export const dateAtualMoment = () => {
  return moment().utc().toDate();
};

export const verificarDataStringValida = (dateString: string) => {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  return pattern.test(dateString);
};
