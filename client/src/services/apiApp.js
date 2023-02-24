import axios from "axios";

export const apiApp = axios.create({
	baseURL: process.env.REACT_APP_URL_APLICATIVO,
	headers: {
		Authorization: `Bearer ${process.env.REACT_APP_TOKEN_APLICATIVO}`,
	},
});
