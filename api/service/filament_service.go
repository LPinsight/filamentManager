package service

import (
	"api/db"
	iface "api/interface"
	"api/models"
	"api/utils"
	"errors"

	"gorm.io/gorm"
)

type FilamentService struct {
	db *gorm.DB
}

// Konstruktor
func NewFilamentService(db *gorm.DB) *FilamentService {
	return &FilamentService{
		db: db,
	}
}

// Alle Filamente abrufen
func (s *FilamentService) GetAll() ([]*iface.Filament, error) {
	var filamentModels []models.Filament

	if err := s.db.Preload("Hersteller").Preload("Material").Find(&filamentModels).Error; err != nil {
		return nil, err
	}

	filamente := make([]*iface.Filament, len(filamentModels))
	for i, filament := range filamentModels {
		filamente[i] = db.ToIfaceFilament(&filament)
	}

	return filamente, nil
}

// Einzelnes Filament abrufen
func (s *FilamentService) GetByID(id string) (*iface.Filament, error) {
	filamentModel, err := s.SearchFilament(id)
	if err != nil {
		return nil, err
	}

	filament := db.ToIfaceFilament(filamentModel)

	return filament, nil
}

// Neues Filament erstellen
func (s *FilamentService) Create(data iface.FilamentData) (*iface.Filament, error) {
	if err := s.db.First(&models.Hersteller{}, "hersteller_id = ?", data.HerstellerID).Error; err != nil {
		return nil, errors.New("hersteller not found")
	}

	if err := s.db.First(&models.Material{}, "material_id = ?", data.MaterialID).Error; err != nil {
		return nil, errors.New("material not found")
	}

	filamentModel := &models.Filament{
		FilamentID:       utils.NewFilamentID(),
		Farbe:            data.Farbe,
		Farbcode:         data.Farbcode,
		HerstellerID:     data.HerstellerID,
		MaterialID:       data.MaterialID,
		Preis:            data.Preis,
		Gewicht_Filament: data.Gewicht_Filament,
		Gewicht_Spule:    data.Gewicht_Spule,
		Link:             data.Link,
		Temp_Extruder:    data.Temp_Extruder,
		Temp_Bed:         data.Temp_Bed,
	}

	if err := s.db.Create(filamentModel).Error; err != nil {
		return nil, err
	}

	if err := s.db.Preload("Hersteller").Preload("Material").
		First(&filamentModel, "filament_id = ?", filamentModel.FilamentID).Error; err != nil {
		return nil, err
	}

	filament := db.ToIfaceFilament(filamentModel)

	return filament, nil
}

// Filament aktualisieren
func (s *FilamentService) Update(id string, data iface.FilamentData) (*iface.Filament, error) {
	// Filament aus DB abrufen
	filament, err := s.SearchFilamentWithoutPreload(id)
	if err != nil {
		return nil, err
	}

	if err := s.db.First(&models.Hersteller{}, "hersteller_id = ?", data.HerstellerID).Error; err != nil {
		return nil, errors.New("hersteller not found")
	}

	if err := s.db.First(&models.Material{}, "material_id = ?", data.MaterialID).Error; err != nil {
		return nil, errors.New("material not found")
	}

	// Felder aktualisieren
	filament.Farbe = data.Farbe
	filament.Farbcode = data.Farbcode
	filament.HerstellerID = data.HerstellerID
	filament.MaterialID = data.MaterialID
	filament.Preis = data.Preis
	filament.Gewicht_Filament = data.Gewicht_Filament
	filament.Gewicht_Spule = data.Gewicht_Spule
	filament.Link = data.Link
	filament.Temp_Extruder = data.Temp_Extruder
	filament.Temp_Bed = data.Temp_Bed

	// Änderungen speichern
	if err := s.db.Save(&filament).Error; err != nil {
		return nil, err
	}

	updated := db.ToIfaceFilament(filament)

	return updated, nil
}

// Hersteller entfernen
func (s *FilamentService) Delete(id string) error {
	result := s.db.Delete(&models.Filament{}, "filament_id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("filament not found")
	}

	return nil
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *FilamentService) SearchFilament(id string) (*models.Filament, error) {
	var filament models.Filament

	if err := s.db.Preload("Hersteller").Preload("Material").First(&filament, "filament_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("filament not found")
		}
		return nil, err
	}

	return &filament, nil
}

func (s *FilamentService) SearchFilamentWithoutPreload(id string) (*models.Filament, error) {
	var filament models.Filament

	if err := s.db.First(&filament, "filament_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("filament not found")
		}
		return nil, err
	}

	return &filament, nil
}
