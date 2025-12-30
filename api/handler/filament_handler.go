package handler

import (
	iface "api/interface"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetFilamentHandler(w http.ResponseWriter, r *http.Request) {
	filament, err := filamentService.GetAll()

	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, filament, http.StatusOK)
}

func GetFilamentByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	filament, err := filamentService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, filament, http.StatusOK)
}

func CreateFilamentHandler(w http.ResponseWriter, r *http.Request) {
	var data iface.FilamentData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	filament, err := filamentService.Create(data)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(w, filament, http.StatusCreated)
}

func DeleteFilamentHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := filamentService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateFilamentHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.FilamentData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	filament, err := filamentService.Update(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, filament, http.StatusOK)
}
