export default {
  normalize: (text: string) =>
    text
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
};
