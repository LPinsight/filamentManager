package main

import (
	"api/db"
	"api/handler"
	"api/router"
	"api/service"
	"fmt"
	"log"

	"github.com/fvbock/endless"
)

// @title           Beispiel API
// @version         1.0
// @description     Das ist eine Beispiel Go API mit Swagger
// @host            localhost:8080
// @BasePath        /api
func main() {
	db.Init()

	materialService := service.NewMaterialService(db.DB)
	herstellerService := service.NewHerstellerService(db.DB)
	ortService := service.NewOrtService(db.DB)
	filamentService := service.NewFilamentService(db.DB)
	spuleService := service.NewSpuleService(db.DB)

	handler.Init(materialService, herstellerService, ortService, filamentService, spuleService)

	router := router.NewRouter()

	fmt.Println("Server started at http://0.0.0.0:8080")
	log.Fatal(endless.ListenAndServe("0.0.0.0:8080", router))
}
