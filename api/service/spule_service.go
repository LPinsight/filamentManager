package service

import (
	"api/db"
	iface "api/interface"
	"api/models"
	"api/utils"
	"errors"

	"gorm.io/gorm"
)

type SpuleService struct {
	db *gorm.DB
}

// Konstruktor
func NewSpuleService(db *gorm.DB) *SpuleService {
	return &SpuleService{
		db: db,
	}
}

// Alle Spulen abrufen
func (s *SpuleService) GetAll() ([]*iface.Spule, error) {
	var spulenModels []models.Spule

	if err := s.db.Preload("Filament").Preload("Filament.Hersteller").Preload("Filament.Material").Preload("Ort").Find(&spulenModels).Error; err != nil {
		return nil, err
	}

	spulen := make([]*iface.Spule, len(spulenModels))
	for i, spule := range spulenModels {
		spulen[i] = db.ToIfaceSpule(&spule)
	}

	return spulen, nil
}

// Einzelne Spule abrufen
func (s *SpuleService) GetByID(id string) (*iface.Spule, error) {
	spuleModel, err := s.SearchSpule(id)
	if err != nil {
		return nil, err
	}

	spule := db.ToIfaceSpule(spuleModel)

	return spule, nil
}

// Neue Spule erstellen
func (s *SpuleService) Create(data iface.SpuleData) (*iface.Spule, error) {
	if err := s.db.First(&models.Filament{}, "filament_id = ?", data.FilamentID).Error; err != nil {
		return nil, errors.New("filament not found")
	}

	if err := s.db.First(&models.Ort{}, "ort_id = ?", data.OrtID).Error; err != nil {
		return nil, errors.New("ort not found")
	}

	spuleModel := &models.Spule{
		SpuleID:              utils.NewSpulenID(),
		FilamentID:           data.FilamentID,
		Verbrauchtes_Gewicht: data.Verbrauchtes_Gewicht,
		NFC:                  data.NFC,
		OrtID:                data.OrtID,
		Archiviert:           data.Archiviert,
	}

	if err := s.db.Create(spuleModel).Error; err != nil {
		return nil, err
	}

	if err := s.db.Preload("Filament").Preload("Filament.Hersteller").Preload("Filament.Material").Preload("Ort").
		First(&spuleModel, "spule_id = ?", spuleModel.SpuleID).Error; err != nil {
		return nil, err
	}

	spule := db.ToIfaceSpule(spuleModel)

	return spule, nil
}

// Spule aktualisieren
func (s *SpuleService) Update(id string, data iface.SpuleData) (*iface.Spule, error) {
	// Spule aus DB abrufen
	spule, err := s.SearchSpule(id)
	if err != nil {
		return nil, err
	}

	// Felder aktualisieren
	spule.FilamentID = data.FilamentID
	spule.Verbrauchtes_Gewicht = data.Verbrauchtes_Gewicht
	spule.NFC = data.NFC
	spule.OrtID = data.OrtID
	spule.Archiviert = data.Archiviert

	// Änderungen speichern
	if err := s.db.Save(&spule).Error; err != nil {
		return nil, err
	}

	updated := db.ToIfaceSpule(spule)

	return updated, nil
}

// Spule entfernen
func (s *SpuleService) Delete(id string) error {
	result := s.db.Delete(&models.Spule{}, "spule_id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("spule not found")
	}

	return nil
}

// Einzelne Spule abrufen
func (s *SpuleService) GetByNfcTag(nfcTag string) (*iface.Spule, error) {
	spuleModel, err := s.SearchSpuleByTag(nfcTag)
	if err != nil {
		return nil, err
	}

	spule := db.ToIfaceSpule(spuleModel)

	return spule, nil
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *SpuleService) SearchSpule(id string) (*models.Spule, error) {
	var spule models.Spule

	if err := s.db.Preload("Filament").Preload("Ort").First(&spule, "spule_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("spule not found")
		}
		return nil, err
	}

	return &spule, nil
}

func (s *SpuleService) SearchSpuleByTag(nfcTag string) (*models.Spule, error) {
	var spule models.Spule

	if err := s.db.Preload("Filament").Preload("Ort").First(&spule, "nfc = ?", nfcTag).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("spule not found")
		}
		return nil, err
	}

	return &spule, nil
}
