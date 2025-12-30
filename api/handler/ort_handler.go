package handler

import (
	iface "api/interface"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetOrtHandler(w http.ResponseWriter, r *http.Request) {
	orte, err := ortService.GetAll()

	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, orte, http.StatusOK)
}

func GetOrtByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	ort, err := ortService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, ort, http.StatusOK)
}

func CreateOrtHandler(w http.ResponseWriter, r *http.Request) {
	var data iface.OrtData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ort, err := ortService.Create(data)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(w, ort, http.StatusCreated)
}

func DeleteOrtHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := ortService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateOrtHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.OrtData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ort, err := ortService.Update(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, ort, http.StatusOK)
}
