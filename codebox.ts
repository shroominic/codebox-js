import axios, { AxiosInstance } from 'axios';

export class CodeBox {
  private axiosInstance: AxiosInstance;
  private session_id: string | null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://codeboxapi.com',
      headers: {
        'Authorization': `Bearer ${process.env.CODEBOX_API_KEY}`,
      },
    });
    this.session_id = null;
  }

  async start() {
    if (this.session_id) {
      console.log("CodeBox is already started!");
      return;
    }

    const response = await this.axiosInstance.get('/codebox/start');
    this.session_id = response.data.id;
    console.log("CodeBox started!");
  }

  async run(code: string) {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    const response = await this.axiosInstance.post(`/codebox/${this.session_id}/run`, { code });
    return response.data;
  }

  async upload(fileName: string, fileContent: string) {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    const response = await this.axiosInstance.post(`/codebox/${this.session_id}/upload`, { fileName, fileContent });
    return response.data;
  }

  async download(fileName: string) {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    const response = await this.axiosInstance.get(`/codebox/${this.session_id}/download/${fileName}`);
    return response.data;
  }

  async install(packageName: string) {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    const response = await this.axiosInstance.post(`/codebox/${this.session_id}/install`, { packageName });
    return response.data;
  }

  async listFiles() {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    const response = await this.axiosInstance.get(`/codebox/${this.session_id}/files`);
    return response.data;
  }

  async restart() {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    const response = await this.axiosInstance.post(`/codebox/${this.session_id}/restart`);
    return response.data;
  }

  async stop() {
    if (!this.session_id) {
      console.warn("CodeBox is not started, nothing to stop.");
      return;
    }

    const response = await this.axiosInstance.post(`/codebox/${this.session_id}/stop`);
    this.session_id = null;
    return response.data;
  }
}
