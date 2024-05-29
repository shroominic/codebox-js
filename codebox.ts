import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

export default class CodeBox {
  private axiosInstance: AxiosInstance;
  private session_id: string | null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.CODEBOX_BASE_URL || 'https://codeboxapi.com/api/v1',
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

    try {
      const response = await this.axiosInstance.get('/codebox/start');
      this.session_id = response.data.id;
      console.log("CodeBox started!");
    } catch (error) {
      this.handleError(error, "Failed to start CodeBox.");
    }
  }

  async run(code: string): Promise<{ type: string; content: string; } | undefined> {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    try {
      const response = await this.axiosInstance.post(`/codebox/${this.session_id}/run`, { code });
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to run code.");
    }
  }

  async upload(fileName: string, fileContent: string): Promise<{ status: string; } | undefined> {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }
    try {
      const formData = new FormData();
      formData.append('file', fileContent, fileName);

      const response = await this.axiosInstance.post(
        `/codebox/${this.session_id}/upload`,
        formData,
        { headers: formData.getHeaders() }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to upload file.");
    }
  }

  async download(fileName: string): Promise<string | undefined> {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    try {
      const response = await this.axiosInstance.get(
        `/codebox/${this.session_id}/download/${fileName}`,
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to download file.");
    }
  }

  async install(packageName: string): Promise<{ status: string; } | undefined> {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    try {
      const response = await this.axiosInstance.post(`/codebox/${this.session_id}/install/${packageName}`);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to install package.");
    }
  }

  async listFiles(): Promise<{ files: string[]; }> {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    try {
      const response = await this.axiosInstance.get(`/codebox/${this.session_id}/files`);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to list files.");
      return { files: [] };
    }
  }

  async restart(): Promise<{ status: string; } | undefined> {
    if (!this.session_id) {
      throw new Error("Make sure to start your CodeBox before using it.");
    }

    try {
      const response = await this.axiosInstance.post(`/codebox/${this.session_id}/restart`);
      return response.data;
    } catch (error) {
      this.handleError(error, "Failed to restart CodeBox.");
    }
  }

  async stop() {
    if (!this.session_id) {
      console.warn("CodeBox is not started, nothing to stop.");
      return;
    }

    try {
      await this.axiosInstance.post(`/codebox/${this.session_id}/stop`);
      this.session_id = null;
    } catch (error) {
      this.handleError(error, "Failed to stop CodeBox.");
    }
  }

  private handleError(error: any, message: string) {
    if (axios.isAxiosError(error)) {
      console.error(`${message} AxiosError: ${error.message}`);
      if (error.response) {
        console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
      }
    } else {
      console.error(`${message} Error: ${error.message}`);
    }
  }
}
