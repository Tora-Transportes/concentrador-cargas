import moment from "moment-timezone";

const getCurrentDate = () => {
  const currentDate = moment
    .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
    .toDate();
  return currentDate;
};
const formatDateTimezone = (data: Date | string) => {
  const currentDate = moment
    .utc(moment(data).tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
    .toDate();
  return currentDate;
};

export default { getCurrentDate, formatDateTimezone };
