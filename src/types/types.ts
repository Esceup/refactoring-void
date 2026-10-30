export interface Service {
  id: number
  name: string
  price: number
}

export interface ServiceItem {
  service: Service
  quantity: number
}
