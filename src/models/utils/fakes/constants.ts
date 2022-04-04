import { Logger } from "@nestjs/common";

export  const fakeLogger = {
    log: (obj: any) => { },
    error: (obj: any) => { },
    debug(message: any, context?: string): void {  },
} as Logger;

export const today = new Date();
const todayGetDate = today.getDate();
export const yesterday = new Date(Date.now() - todayGetDate);
export const dayBeforeYesterday = new Date(yesterday.getTime() - todayGetDate);
export const tomorrow = new Date(Date.now() + todayGetDate);
export const dayAfterTomorrow = new Date(tomorrow.getTime() + todayGetDate);

