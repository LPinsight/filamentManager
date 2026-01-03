package db

import (
	iface "api/interface"
	"api/models"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	_ = godotenv.Load()
	var user, password, host, port, name string

	// externe DB -> aus ENV
	user = os.Getenv("DB_USER")
	password = os.Getenv("DB_PASSWORD")
	host = os.Getenv("DB_HOST")
	port = os.Getenv("DB_PORT")
	name = os.Getenv("DB_NAME")

	if user == "" || password == "" || host == "" || port == "" || name == "" {
		log.Fatal("❌ Externe DB aktiviert, aber Variablen fehlen (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)")
	}

	var dsn string
	dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port)

	// 1️⃣ Verbindung zur MariaDB herstellen (ohne Datenbank)
	sqlDB, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ Konnte Verbindung zur DB herstellen: %v", err)
	}

	// 2️⃣ Datenbank anlegen, falls sie noch nicht existiert
	_, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci", name))
	if err != nil {
		log.Fatalf("❌ Konnte Datenbank nicht erstellen: %v", err)
	}

	sqlDB.Close() // Schließen der reinen SQL-Verbindung

	// 3️⃣ Verbindung mit GORM zur richtigen Datenbank
	dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, name)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Konnte keine Verbindung zur DB aufbauen: %v", err)
	}

	// Automatische Migration (alle Models)
	err = database.AutoMigrate(
		&models.Material{},
		&models.Hersteller{},
		&models.Ort{},
		&models.Filament{},
		&models.Spule{},
		// weitere Models...
	)
	if err != nil {
		log.Fatalf("❌ Migration fehlgeschlagen: %v", err)
	}

	DB = database
	log.Println("✅ MySQL-Verbindung steht & Migration abgeschlossen")
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func ToIfaceMaterial(m *models.Material) *iface.Material {
	if m == nil {
		return nil
	}

	material := &iface.Material{
		ID:          m.MaterialID,
		Name:        m.Name,
		Durchmesser: m.Durchmesser,
		Dichte:      m.Dichte,
	}

	return material
}

func ToIfaceHersteller(m *models.Hersteller) *iface.Hersteller {
	if m == nil {
		return nil
	}

	hersteller := &iface.Hersteller{
		ID:   m.HerstellerID,
		Name: m.Name,
	}

	return hersteller
}

func ToIfaceOrt(m *models.Ort) *iface.Ort {
	if m == nil {
		return nil
	}

	ort := &iface.Ort{
		ID:   m.OrtID,
		Name: m.Name,
	}

	return ort
}

func ToIfaceFilament(m *models.Filament) *iface.Filament {
	if m == nil {
		return nil
	}

	filament := &iface.Filament{
		ID:               m.FilamentID,
		Farbe:            m.Farbe,
		Farbcode:         m.Farbcode,
		Preis:            m.Preis,
		Gewicht_Filament: m.Gewicht_Filament,
		Gewicht_Spule:    m.Gewicht_Spule,
		Link:             m.Link,
		Temp_Extruder:    m.Temp_Extruder,
		Temp_Bed:         m.Temp_Bed,
	}

	if hersteller := ToIfaceHersteller(&m.Hersteller); hersteller != nil {
		filament.Hersteller = *hersteller
	}

	if material := ToIfaceMaterial(&m.Material); material != nil {
		filament.Material = *material
	}

	return filament
}

func ToIfaceSpule(m *models.Spule) *iface.Spule {
	if m == nil {
		return nil
	}

	spule := &iface.Spule{
		ID:                   m.SpuleID,
		Verbrauchtes_Gewicht: m.Verbrauchtes_Gewicht,
		NFC:                  m.NFC,
		Nummer:               m.Nummer,
		Archiviert:           m.Archiviert,
	}

	if filament := ToIfaceFilament(&m.Filament); filament != nil {
		spule.Filament = *filament
		spule.Verbleibendes_Gewicht = filament.Gewicht_Filament - m.Verbrauchtes_Gewicht
	}

	if ort := ToIfaceOrt(m.Ort); ort != nil {
		spule.Ort = *ort
	}

	return spule
}
