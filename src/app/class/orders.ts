export class Orders {
  constructor(
    public id: number,
    public code: string,
    public cart: number,
    public created: string,
    public customer: string,
    public email: string,
    public reason: string,
    public status: string,
  ){  }
}
