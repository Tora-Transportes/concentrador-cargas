import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface Position {
  x: string;
  y: string;
  z: string;
}

interface DocumentData {
  name: string;
  cpf: string;
  document_name: string;
  mes: string;
  ano: string;
  url_file: string;
  positions: Position;
  base64_file: string;
}

class ServiceAutentique {
  private baseUrl: string;

  constructor(baseUrl = String(process.env.URL_API_ASSINADOR)) {
    this.baseUrl = baseUrl;
  }

  private getConfig(data: DocumentData): AxiosRequestConfig {
    return {
      method: "post",
      maxBodyLength: Infinity,
      url: `${this.baseUrl}/autentique/ppo/documents`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };
  }

  async createDocument(documentData: DocumentData): Promise<AxiosResponse> {
    try {
      const config: AxiosRequestConfig = this.getConfig(documentData);
      const response: AxiosResponse = await axios.request(config);
      return response;
    } catch (error: any) {
      return error.response;
    }
  }
}

export default ServiceAutentique;
