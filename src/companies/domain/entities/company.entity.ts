export class Company {
    constructor(
        public readonly cuit: string,
        public readonly name: string,
        public readonly adhesionDate: Date,
        public readonly id?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}