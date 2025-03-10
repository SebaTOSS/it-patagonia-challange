import { Company } from "./company.entity";

export class Transfer {
    constructor(
        public readonly id: string,
        public readonly amount: number,
        public readonly debitAccount: string,
        public readonly creditAccount: string,
        public readonly date: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly company: Company,
    ) { }
}