package iface

type Ort struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type OrtData struct {
	Name string `json:"name"`
}

type SortRequest struct {
	ID        string `json:"id"`
	SortIndex int    `json:"sortIndex"`
}
