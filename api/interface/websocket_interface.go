package iface

import "github.com/gorilla/websocket"

type Client struct {
	Conn   *websocket.Conn
	Source string // "nodemcu" | "web"
}

type Msg struct {
	Type    string                 `json:"type"`
	Source  string                 `json:"source"`
	Payload map[string]interface{} `json:"payload"`
}

type RfidAssignmentState struct {
	Active  bool
	SpoolID string
}
