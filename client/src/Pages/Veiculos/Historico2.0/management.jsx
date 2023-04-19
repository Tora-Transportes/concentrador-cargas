export const convertNinutosHoras = (date) => {
  if (date > 0) {
    const horas = Math.floor(date / 60);
    const minutos = date % 60;

    return `${horas}h ${minutos}min`;
  }

  return 0;
};

export const tableLineTop = () => {
  // Selecione a linha que foi clicada
  const selectedRow = document.querySelector(".selected");

  // Obtenha a posição da linha em relação à parte superior da tabela
  const selectedRowTop = selectedRow.offsetTop;

  // Obtenha a altura da tabela
  const tableHeight = document.querySelector(".table-historico").offsetHeight;

  // Se a linha selecionada estiver abaixo da metade da tabela, role a tabela para cima
  if (selectedRowTop > tableHeight / 4) {
    document.querySelector(".table-historico").scrollTop =
      selectedRowTop - tableHeight / 4;
  }
};
