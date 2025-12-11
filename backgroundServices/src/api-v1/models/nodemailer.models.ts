export interface INodemailerConfig {
  host: string;
  service: string;
  port: number;
  auth: {
    user?: string;
    pass?: string;
  };
}

export interface INodemailerMessage {
  from?: string;
  to?: string;
  subject: string;
  html: string;
}
