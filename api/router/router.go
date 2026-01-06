package router

import (
	"net/http"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"

	_ "api/docs" // 👈 wichtig!
	"api/handler"
)

func NewRouter() http.Handler {
	router := mux.NewRouter()
	router.Use(enableCORS)

	// Main API routes
	api := router.PathPrefix("/api").Subrouter()
	// router.HandleFunc("/version", handler.GetVersion).Methods("GET", "OPTIONS")
	api.HandleFunc("/health", handler.HealthHandler).Methods("GET", "OPTIONS")

	// /material
	materialRouter := api.PathPrefix("/material").Subrouter()
	materialRouter.HandleFunc("", handler.GetMaterialHandler).Methods("GET", "OPTIONS")
	materialRouter.HandleFunc("", handler.CreateMaterialHandler).Methods("POST", "OPTIONS")

	// /material/<id>
	materialById := materialRouter.PathPrefix("/{id:M-[0-9a-fA-F-]+}").Subrouter()
	materialById.HandleFunc("", handler.GetMaterialByIDHandler).Methods("GET", "OPTIONS")
	materialById.HandleFunc("", handler.UpdateMaterialHandler).Methods("PUT", "OPTIONS")
	materialById.HandleFunc("", handler.DeleteMaterialHandler).Methods("DELETE", "OPTIONS")

	// /hersteller
	herstellerRouter := api.PathPrefix("/hersteller").Subrouter()
	herstellerRouter.HandleFunc("", handler.GetHerstellerHandler).Methods("GET", "OPTIONS")
	herstellerRouter.HandleFunc("", handler.CreateHerstellerHandler).Methods("POST", "OPTIONS")

	// /hersteller/<id>
	herstellerById := herstellerRouter.PathPrefix("/{id:H-[0-9a-fA-F-]+}").Subrouter()
	herstellerById.HandleFunc("", handler.GetHerstellerByIDHandler).Methods("GET", "OPTIONS")
	herstellerById.HandleFunc("", handler.UpdateHerstellerHandler).Methods("PUT", "OPTIONS")
	herstellerById.HandleFunc("", handler.DeleteHerstellerHandler).Methods("DELETE", "OPTIONS")

	// /ort
	ortRouter := api.PathPrefix("/ort").Subrouter()
	ortRouter.HandleFunc("", handler.GetOrtHandler).Methods("GET", "OPTIONS")
	ortRouter.HandleFunc("", handler.CreateOrtHandler).Methods("POST", "OPTIONS")

	// /ort/<id>
	ortById := ortRouter.PathPrefix("/{id:O-[0-9a-fA-F-]+}").Subrouter()
	ortById.HandleFunc("", handler.GetOrtByIDHandler).Methods("GET", "OPTIONS")
	ortById.HandleFunc("", handler.UpdateOrtHandler).Methods("PUT", "OPTIONS")
	ortById.HandleFunc("", handler.DeleteOrtHandler).Methods("DELETE", "OPTIONS")

	// /filament
	filamentRouter := api.PathPrefix("/filament").Subrouter()
	filamentRouter.HandleFunc("", handler.GetFilamentHandler).Methods("GET", "OPTIONS")
	filamentRouter.HandleFunc("", handler.CreateFilamentHandler).Methods("POST", "OPTIONS")

	// /filament/<id>
	filamentById := filamentRouter.PathPrefix("/{id:F-[0-9a-fA-F-]+}").Subrouter()
	filamentById.HandleFunc("", handler.GetFilamentByIDHandler).Methods("GET", "OPTIONS")
	filamentById.HandleFunc("", handler.UpdateFilamentHandler).Methods("PUT", "OPTIONS")
	filamentById.HandleFunc("", handler.DeleteFilamentHandler).Methods("DELETE", "OPTIONS")

	// /spule
	spuleRouter := api.PathPrefix("/spule").Subrouter()
	spuleRouter.HandleFunc("", handler.GetSpuleHandler).Methods("GET", "OPTIONS")
	spuleRouter.HandleFunc("", handler.CreateSpuleHandler).Methods("POST", "OPTIONS")

	// /spule/nfc
	spuleByNfc := spuleRouter.PathPrefix("/nfc").Subrouter()
	// spuleByNfc.HandleFunc("", handler.GetSpuleByNfcHandler).Methods("GET", "OPTIONS")

	// /spule/nfc/<tag>
	spuleByNfcTag := spuleByNfc.PathPrefix("/{tag}").Subrouter()
	spuleByNfcTag.HandleFunc("", handler.GetSpuleByNfcTagHandler).Methods("GET", "OPTIONS")

	// /spule/<id>
	spuleById := spuleRouter.PathPrefix("/{id:S-[0-9a-fA-F-]+}").Subrouter()
	spuleById.HandleFunc("", handler.GetSpuleByIDHandler).Methods("GET", "OPTIONS")
	spuleById.HandleFunc("", handler.UpdateSpuleHandler).Methods("PUT", "OPTIONS")
	spuleById.HandleFunc("", handler.DeleteSpuleHandler).Methods("DELETE", "OPTIONS")
	spuleById.HandleFunc("/archiv", handler.UpdateArchivHandler).Methods("PATCH", "OPTIONS")
	spuleById.HandleFunc("/ort", handler.UpdateSpulenOrtHandler).Methods("PATCH", "OPTIONS")
	spuleById.HandleFunc("/nfc/remove", handler.RemoveSpulenNfcHandler).Methods("PATCH", "OPTIONS")
	spuleById.HandleFunc("/nummer", handler.UpdateSpulenNummerHandler).Methods("PATCH", "OPTIONS")

	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	return router
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, PATCH, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
