package handler

import (
	iface "api/interface"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetMaterialHandler(w http.ResponseWriter, r *http.Request) {
	materials, err := materialService.GetAll()

	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, materials, http.StatusOK)
}

func GetMaterialByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	material, err := materialService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, material, http.StatusOK)
}

func CreateMaterialHandler(w http.ResponseWriter, r *http.Request) {
	var data iface.MaterialData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	material, err := materialService.Create(data)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(w, material, http.StatusCreated)
}

func DeleteMaterialHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := materialService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateMaterialHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.MaterialData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	material, err := materialService.Update(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, material, http.StatusOK)
}
