package handler

import (
	iface "api/interface"
	"api/service"
	"encoding/json"
	"net/http"
)

var materialService *service.MaterialService
var herstellerService *service.HerstellerService
var ortService *service.OrtService
var filamentService *service.FilamentService
var spuleService *service.SpuleService

func Init(ms *service.MaterialService, hs *service.HerstellerService, os *service.OrtService, fs *service.FilamentService, ss *service.SpuleService) {
	materialService = ms
	herstellerService = hs
	ortService = os
	filamentService = fs
	spuleService = ss
}

// HealthHandler godoc
// @Summary      Health Check
// @Description  Prüft ob die API läuft
// @Tags         health
// @Produce      json
// @Success      200  {object}  iface.HealthResponse
// @Router       /health [get]
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(iface.HealthResponse{
		Status: "ok",
	})
}

// Hilfsfunktion zum einheitlichen JSON-Response
func writeJSON(w http.ResponseWriter, v any, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
