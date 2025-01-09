import axios from 'axios';

export const getUserDetails = async (token) => {
  try {
    const response = await axios.get('http://sua-api.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário', error);
    return null;
  }
};
