export interface WebSocketMessage<T = any> {
  type: string
  source: 'nodemcu' | 'web' | 'api'
  target?: 'nodemcu' | 'web'
  payload?: T
}

export interface RegisterMessage extends WebSocketMessage {
  type: 'register',
  source: 'web'
}

export interface AssignSpoolMessage extends WebSocketMessage<{spoolId: number}> {
  type: 'assign_spool',
  source: 'web'
}

export interface ButtonPressPayload {
  button: string
  state: 'pressed'
}

export interface RfidScanPayload {
  uid: string
}

export interface WeightScanPayload {
  spoolId: string
}