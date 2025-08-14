export class Products {
  constructor(
    public id: number,
    public store: number,
    public image: string,
    public category: string,
    public name: string,
    public price: string,
    public sales: string,
    public quantity: number,
    public created: string,
    public stock_status: string,
    public status: string
  ){  }
}
