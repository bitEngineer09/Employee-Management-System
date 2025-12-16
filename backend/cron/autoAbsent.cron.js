import cron from 'node-cron';
import { markAutoAbsent } from '../services/autoAbsent.service.js';

export const startAutoAbsentCron = () => {
    // ye har din 11:59 pm pe chalega
    cron.schedule("59 23 * * *", async () => {
        try {
            console.log("Running auto absent cron...");
            await markAutoAbsent();
        } catch (error) {
            console.error("Auto absent cron failed:", error.message);
        }
    });
};