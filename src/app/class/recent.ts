export class ROrders {
  constructor(
    public code: string,
    public created_at: string,
    public customer: string,
    public amount: string,
    public status: string,
  ){  }
}
