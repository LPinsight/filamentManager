package service

import (
	"api/db"
	iface "api/interface"
	"api/models"
	"api/utils"
	"errors"

	"gorm.io/gorm"
)

type HerstellerService struct {
	db *gorm.DB
}

// Konstruktor
func NewHerstellerService(db *gorm.DB) *HerstellerService {
	return &HerstellerService{
		db: db,
	}
}

// Alle Hersteller abrufen
func (s *HerstellerService) GetAll() ([]*iface.Hersteller, error) {
	var herstellerModels []models.Hersteller

	if err := s.db.Order("name asc").Find(&herstellerModels).Error; err != nil {
		return nil, err
	}

	herstellers := make([]*iface.Hersteller, len(herstellerModels))
	for i, hersteller := range herstellerModels {
		herstellers[i] = db.ToIfaceHersteller(&hersteller)
	}

	return herstellers, nil
}

// Einzelnen Hersteller abrufen
func (s *HerstellerService) GetByID(id string) (*iface.Hersteller, error) {
	herstellerModel, err := s.SearchHersteller(id)
	if err != nil {
		return nil, err
	}

	hersteller := db.ToIfaceHersteller(herstellerModel)

	return hersteller, nil
}

// Neuen Hersteller erstellen
func (s *HerstellerService) Create(data iface.HerstellerData) (*iface.Hersteller, error) {
	herstellerModel := &models.Hersteller{
		HerstellerID: utils.NewHerstellerID(),
		Name:         data.Name,
	}

	if err := s.db.Create(herstellerModel).Error; err != nil {
		return nil, err
	}

	hersteller := db.ToIfaceHersteller(herstellerModel)

	return hersteller, nil
}

// Hersteller aktualisieren
func (s *HerstellerService) Update(id string, data iface.HerstellerData) (*iface.Hersteller, error) {
	// hersteller aus DB abrufen
	hersteller, err := s.SearchHersteller(id)
	if err != nil {
		return nil, err
	}

	// Felder aktualisieren
	hersteller.Name = data.Name

	// Änderungen speichern
	if err := s.db.Save(&hersteller).Error; err != nil {
		return nil, err
	}

	updated := db.ToIfaceHersteller(hersteller)

	return updated, nil
}

// Hersteller entfernen
func (s *HerstellerService) Delete(id string) error {
	result := s.db.Delete(&models.Hersteller{}, "hersteller_id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("hersteller not found")
	}

	return nil
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *HerstellerService) SearchHersteller(id string) (*models.Hersteller, error) {
	var hersteller models.Hersteller

	if err := s.db.First(&hersteller, "hersteller_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("hersteller not found")
		}
		return nil, err
	}

	return &hersteller, nil
}
