export class Timecard {
  constructor(
    public id: number,
    public title: string,
    public description: string | null,
    public yearStart: number,
    public monthStart: number | null,
    public dayStart: number | null,
    public yearEnd: number | null,
    public monthEnd: number | null,
    public dayEnd: number | null,
  ) {}
}