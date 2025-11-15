
export interface SqlConfig {
    host:string,
    user?:string,
    database?:string,
    password?:string,
    waitForConnections: boolean,
    connectionLimit: number,
    maxIdle: number,
    idleTimeout: number, 
    queueLimit: number,
    enableKeepAlive: boolean,
    keepAliveInitialDelay: number,
}
