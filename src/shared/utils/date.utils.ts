export class DateUtils {
    /**
     * Gets the range of the last month in UTC
     * @returns Object with start and end dates
     */
    getLastMonthRange(): { start: Date; end: Date } {
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));

        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);

        return { start, end };
    }

    /**
     * Gets current date in UTC
     * @returns Current date in UTC
     */
    getCurrentDate(): Date {
        const now = new Date();
        return new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            )
        );
    }

    /**
     * Formats a date to ISO string
     * @param date Date to format
     * @returns ISO string date
     */
    toISODateString(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}