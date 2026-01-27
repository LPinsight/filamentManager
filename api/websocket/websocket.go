package websocket

import (
	iface "api/interface"
	"api/service"
	"encoding/json"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type WebSocketService struct {
	clients  map[*iface.Client]bool
	upgrader websocket.Upgrader
	mutex    sync.RWMutex

	rfidState    *iface.RfidAssignmentState
	spuleService *service.SpuleService
}

func NewWebSocketService(spuleService *service.SpuleService) *WebSocketService {
	return &WebSocketService{
		clients: make(map[*iface.Client]bool),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
		rfidState:    &iface.RfidAssignmentState{Active: false},
		spuleService: spuleService,
	}
}

func (ws *WebSocketService) Handler(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	defer conn.Close()

	client := &iface.Client{
		Conn:   conn,
		Source: "",
	}

	ws.mutex.Lock()
	ws.clients[client] = true
	ws.mutex.Unlock()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			ws.mutex.Lock()
			delete(ws.clients, client)
			ws.mutex.Unlock()
			break
		}

		ws.handleMessage(client, msg)
	}
}

func (ws *WebSocketService) handleMessage(client *iface.Client, raw []byte) {
	var msg iface.Msg

	if err := json.Unmarshal(raw, &msg); err != nil {
		return
	}

	if msg.Type == "register" {
		client.Source = msg.Source
		return
	}

	if client.Source == "" {
		return
	}

	switch msg.Type {
	case "rfid_scan":
		ws.handleRfidScan(msg)
	case "assign_spool":
		ws.handleAssignSpool(msg)
	case "cancel_rfid_assign":
		ws.handleCancelAssign()
	case "rfid_weight_scan":
		ws.handleWeightScan(msg)
	default:
	}
}

func (ws *WebSocketService) sendTo(target string, msg []byte) {
	ws.mutex.RLock()
	defer ws.mutex.RUnlock()

	for client := range ws.clients {
		if client.Source == target {
			client.Conn.WriteMessage(websocket.TextMessage, msg)
		}
	}
}

func (ws *WebSocketService) handleAssignSpool(msg iface.Msg) {
	var spoolId string
	var farbe string
	var nummer int
	var hersteller string

	ws.mutex.Lock()

	if ws.rfidState.Active {
		ws.mutex.Unlock()
		ws.sendAssignError("Bereits eine NFC-Zuordnung aktiv")
		return
	}

	rawSpoolId, ok := msg.Payload["spoolId"].(string)
	if !ok || rawSpoolId == "" {
		ws.mutex.Unlock()
		ws.sendAssignError("Ungültige Spulen-ID")
		return
	}

	ws.rfidState.Active = true
	ws.rfidState.SpoolID = rawSpoolId
	spoolId = rawSpoolId

	ws.mutex.Unlock()

	spule, err := ws.spuleService.GetByID(spoolId)
	if err != nil {
		ws.resetRfidState()
		ws.sendAssignError("Spule nicht gefunden")
		return
	}

	farbe = spule.Filament.Farbe
	nummer = spule.Nummer
	hersteller = spule.Filament.Hersteller.Name

	ws.sendStartRfidScan(spoolId, farbe, nummer, hersteller)
	ws.sendAssignStarted(spoolId)
}

func (ws *WebSocketService) handleRfidScan(msg iface.Msg) {
	var spoolId string
	var uid string

	ws.mutex.Lock()

	if !ws.rfidState.Active {
		ws.mutex.Unlock()
		return
	}

	rawUid, ok := msg.Payload["uid"].(string)
	if !ok {
		ws.mutex.Unlock()
		ws.sendAssignError("Ungültige NFC-ID")
		return
	}

	spoolId = ws.rfidState.SpoolID
	uid = rawUid

	ws.rfidState.Active = false
	ws.rfidState.SpoolID = ""

	ws.mutex.Unlock()

	existing, err := ws.spuleService.GetByNfcTag(uid)
	if err == nil && existing != nil {
		ws.sendAssignError("NFC-Tag ist bereits vergeben")
		return
	}

	_, err = ws.spuleService.SetNfc(spoolId, uid)
	if err != nil {
		ws.sendAssignError("NFC konnte nicht gespeichert werden")
		return
	}

	ws.sendAssignSuccess()
	ws.sendRfidSuccess()
}

func (ws *WebSocketService) resetRfidState() {
	ws.mutex.Lock()
	defer ws.mutex.Unlock()

	ws.rfidState.Active = false
	ws.rfidState.SpoolID = ""
}

func (ws *WebSocketService) sendStartRfidScan(spoolId string, farbe string, nummer int, hersteller string) {
	msg, _ := json.Marshal(map[string]interface{}{
		"type":   "start_rfid_scan",
		"source": "api",
		"target": "nodemcu",
		"payload": map[string]interface{}{
			"spoolId":    spoolId,
			"farbe":      farbe,
			"nummer":     nummer,
			"hersteller": hersteller,
		},
	})

	ws.sendTo("nodemcu", msg)
}

func (ws *WebSocketService) sendAssignStarted(spoolId string) {
	msg, _ := json.Marshal(map[string]interface{}{
		"type":   "assign_started",
		"source": "api",
		"target": "web",
		"payload": map[string]interface{}{
			"spoolId": spoolId,
		},
	})

	ws.sendTo("web", msg)
}

func (ws *WebSocketService) sendAssignSuccess() {
	msg, _ := json.Marshal(map[string]interface{}{
		"type":   "assign_success",
		"source": "api",
		"target": "web",
	})

	ws.sendTo("web", msg)
}

func (ws *WebSocketService) sendAssignError(message string) {
	msg, _ := json.Marshal(map[string]interface{}{
		"type":   "assign_error",
		"source": "api",
		"target": "web",
		"payload": map[string]interface{}{
			"message": message,
		},
	})

	ws.sendTo("web", msg)
}

func (ws *WebSocketService) sendRfidSuccess() {
	msg, _ := json.Marshal(map[string]interface{}{
		"type":   "rfid_success",
		"source": "api",
		"target": "nodemcu",
	})

	ws.sendTo("nodemcu", msg)
}

func (ws *WebSocketService) handleCancelAssign() {
	shouldNotify := false

	ws.mutex.Lock()
	if ws.rfidState.Active {
		ws.rfidState.Active = false
		ws.rfidState.SpoolID = ""
		shouldNotify = true
	}
	ws.mutex.Unlock()

	if shouldNotify {
		ws.sendAssignError("NFC-Zuordnung abgebrochen")
	}
}

func (ws *WebSocketService) handleWeightScan(msg iface.Msg) {
	rawUid, ok := msg.Payload["uid"].(string)
	if !ok || rawUid == "" {
		return
	}

	spule, err := ws.spuleService.GetByNfcTag(rawUid)
	if err != nil {
		return
	}

	ws.sendOpenWeightDialog(spule)
}

func (ws *WebSocketService) sendOpenWeightDialog(spule *iface.Spule) {
	msg, _ := json.Marshal(map[string]interface{}{
		"type":   "open_weight_dialog",
		"source": "api",
		"target": "web",
		"payload": map[string]interface{}{
			"spoolId": spule.ID,
		},
	})

	ws.sendTo("web", msg)
}
