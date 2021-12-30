import moment from "moment-timezone";

const getCurrentDate = () => {
  const currentDate = moment
    .utc(moment.tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss"))
    .toDate();
  return currentDate;
};

export default { getCurrentDate };
