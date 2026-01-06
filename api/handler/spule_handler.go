package handler

import (
	iface "api/interface"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func GetSpuleHandler(w http.ResponseWriter, r *http.Request) {
	spule, err := spuleService.GetAll()

	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, spule, http.StatusOK)
}

func GetSpuleByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	spule, err := spuleService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}

func CreateSpuleHandler(w http.ResponseWriter, r *http.Request) {
	var data iface.SpuleData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spule, err := spuleService.Create(data)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(w, spule, http.StatusCreated)
}

func DeleteSpuleHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := spuleService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateSpuleHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.SpuleData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spule, err := spuleService.Update(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}

func GetSpuleByNfcTagHandler(w http.ResponseWriter, r *http.Request) {
	nfcTag := mux.Vars(r)["tag"]

	spule, err := spuleService.GetByNfcTag(nfcTag)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}

func UpdateArchivHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.ArchivRequest
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spule, err := spuleService.UpdateArchiv(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}

func UpdateSpulenOrtHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.OrtRequest
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spule, err := spuleService.UpdateOrt(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}

func RemoveSpulenNfcHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.NfcRemoveRequest
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spule, err := spuleService.RemoveNfc(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}

func UpdateSpulenNummerHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.NummerRequest
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	spule, err := spuleService.UpdateNummer(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, spule, http.StatusOK)
}
