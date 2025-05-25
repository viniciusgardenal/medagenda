export const formatarDataHoraBR = (data, hora) => {
  if (!data || !hora) return "";
  try {
    const [ano, mes, dia] = data.split("-");
    const dataBR = `${dia}/${mes}/${ano}`;
    const horaBR = hora.split(":").slice(0, 2).join(":");
    return `${dataBR} - ${horaBR}`;
  } catch (error) {
    return `${data} - ${hora}`;
  }
};
