package handler

import (
	iface "api/interface"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetHerstellerHandler(w http.ResponseWriter, r *http.Request) {
	hersteller, err := herstellerService.GetAll()

	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, hersteller, http.StatusOK)
}

func GetHerstellerByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	hersteller, err := herstellerService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, hersteller, http.StatusOK)
}

func CreateHerstellerHandler(w http.ResponseWriter, r *http.Request) {
	var data iface.HerstellerData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	hersteller, err := herstellerService.Create(data)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(w, hersteller, http.StatusCreated)
}

func DeleteHerstellerHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := herstellerService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateHerstellerHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.HerstellerData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	hersteller, err := herstellerService.Update(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, hersteller, http.StatusOK)
}
