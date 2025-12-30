package service

import (
	"api/db"
	iface "api/interface"
	"api/models"
	"api/utils"
	"errors"

	"gorm.io/gorm"
)

type MaterialService struct {
	db *gorm.DB
}

// Konstruktor
func NewMaterialService(db *gorm.DB) *MaterialService {
	return &MaterialService{
		db: db,
	}
}

// Alle Materialien abrufen
func (s *MaterialService) GetAll() ([]*iface.Material, error) {
	var materialModels []models.Material

	if err := s.db.Find(&materialModels).Error; err != nil {
		return nil, err
	}

	materials := make([]*iface.Material, len(materialModels))
	for i, material := range materialModels {
		materials[i] = db.ToIfaceMaterial(&material)
	}

	return materials, nil
}

// Einzelnes Material abrufen
func (s *MaterialService) GetByID(id string) (*iface.Material, error) {
	materialModel, err := s.SearchMaterial(id)
	if err != nil {
		return nil, err
	}

	material := db.ToIfaceMaterial(materialModel)

	return material, nil
}

// Neues Material erstellen
func (s *MaterialService) Create(data iface.MaterialData) (*iface.Material, error) {
	materialModel := &models.Material{
		MaterialID:  utils.NewMaterialID(),
		Name:        data.Name,
		Durchmesser: data.Durchmesser,
		Dichte:      data.Dichte,
	}

	if err := s.db.Create(materialModel).Error; err != nil {
		return nil, err
	}

	material := db.ToIfaceMaterial(materialModel)

	return material, nil
}

// Material aktualisieren
func (s *MaterialService) Update(id string, data iface.MaterialData) (*iface.Material, error) {
	// material aus DB abrufen
	material, err := s.SearchMaterial(id)
	if err != nil {
		return nil, err
	}

	// Felder aktualisieren
	material.Name = data.Name
	material.Dichte = data.Dichte
	material.Durchmesser = data.Durchmesser

	// Änderungen speichern
	if err := s.db.Save(&material).Error; err != nil {
		return nil, err
	}

	updated := db.ToIfaceMaterial(material)

	return updated, nil
}

// Material entfernen
func (s *MaterialService) Delete(id string) error {
	result := s.db.Delete(&models.Material{}, "material_id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("material not found")
	}

	return nil
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *MaterialService) SearchMaterial(id string) (*models.Material, error) {
	var material models.Material

	if err := s.db.First(&material, "material_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("material not found")
		}
		return nil, err
	}

	return &material, nil
}
