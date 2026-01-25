export interface WebSocketMessage<T = any> {
  type: string
  source: 'nodemcu' | 'web'
  payload: T
}

export interface ButtonPressPayload {
  button: string
  state: 'pressed'
}

export interface RfidScanPayload {
  uid: string
}