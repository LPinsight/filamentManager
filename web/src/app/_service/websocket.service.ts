import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { ButtonPressPayload, RfidScanPayload, WebSocketMessage } from '../_interface/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private URL: string = `ws://192.168.178.193:8080/ws`
  private socket!: WebSocket

  private buttonPress$ = new Subject<ButtonPressPayload>()
  private rfidScan$ = new Subject<RfidScanPayload>()
  private assignStarted$ = new Subject<number>()
  private assignResult$ = new Subject<{success: boolean; message?: string}>()

  constructor(
    private toastService: ToastService
  ) { }

  connect(): void {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) return;
    
    this.socket = new WebSocket(this.URL);

    this.socket.onopen = () => {
      this.sendMessage({
        type: 'register',
        source: 'web',
      })
    }

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WebSocketMessage

        switch(msg.type) {
          case 'assign_started':
            this.assignStarted$.next(msg.payload.spoolId)
            break
          case 'assign_success':
            this.assignResult$.next({success: true})
            break
          case 'assign_error':
            this.assignResult$.next({success: false, message: msg.payload.message})
            break
          case 'button_press':
            this.buttonPress$.next(msg.payload as ButtonPressPayload)
            break
          case 'rfid_scan':
            this.rfidScan$.next(msg.payload as RfidScanPayload)
            break

          default:
            this.toastService.warning(msg.payload, "Unbekannter WS-Typ:")
        }
      } catch (e) {
        this.toastService.warning(event.data, "Ungültige WS-Nachricht:")
      }
    };

    this.socket.onclose = (event) => {
      this.reconnect()
    };

    this.socket.onerror = (event) => {
      this.reconnect()
    }
  }

  sendMessage<T>(msg: WebSocketMessage<T>) {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      this.toastService.warning('WebSocket ist nicht verbunden.', 'WebSocket-Fehler');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private reconnect(delay = 5000) {
      setTimeout(() => this.connect(), delay); // Reconnect after 5 seconds
  }

  onAssignStarted() {
    return this.assignStarted$.asObservable()
  }

  onAssignResult() {
    return this.assignResult$.asObservable()
  }

  onButtonPress(): Observable<ButtonPressPayload> {
    return this.buttonPress$.asObservable()
  }

  onRfidScan(): Observable<RfidScanPayload> {
    return this.rfidScan$.asObservable()
  }

}
