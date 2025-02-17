// Types for logging service
export type LLMRequestType = 'PDF_ANALYSIS' | 'MANUAL_J_CALCULATION' | 'DATA_EXTRACTION';
export type LogStatus = 'SUCCESS' | 'ERROR';

export interface LogEntry {
    id: string;
    timestamp: Date;
    requestType: LLMRequestType;
    prompt: string;
    response: string;
    processingTime: number;
    status: LogStatus;
    errorMessage?: string;
}

export class LoggingService {
    private static instance: LoggingService;
    private logs: LogEntry[] = [];

    private constructor() {}

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    public logLLMInteraction(
        requestType: LLMRequestType,
        prompt: string,
        response: string,
        processingTime: number,
        status: LogStatus,
        errorMessage?: string
    ): LogEntry {
        const logEntry: LogEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            requestType,
            prompt,
            response,
            processingTime,
            status,
            errorMessage
        };

        this.logs.push(logEntry);
        return logEntry;
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public getLogById(id: string): LogEntry | undefined {
        return this.logs.find(log => log.id === id);
    }

    public clearLogs(): void {
        this.logs = [];
    }

    public getLogsByRequestType(requestType: LLMRequestType): LogEntry[] {
        return this.logs.filter(log => log.requestType === requestType);
    }

    public getLogsByStatus(status: LogStatus): LogEntry[] {
        return this.logs.filter(log => log.status === status);
    }

    public getLatestLogs(count: number): LogEntry[] {
        return this.logs.slice(-count);
    }
}

// Export singleton instance
export const loggingService = LoggingService.getInstance();