package service

import (
	"api/db"
	iface "api/interface"
	"api/models"
	"api/utils"
	"errors"

	"gorm.io/gorm"
)

type OrtService struct {
	db *gorm.DB
}

// Konstruktor
func NewOrtService(db *gorm.DB) *OrtService {
	return &OrtService{
		db: db,
	}
}

// Alle Orte abrufen
func (s *OrtService) GetAll() ([]*iface.Ort, error) {
	var ortModels []models.Ort

	if err := s.db.Order("sort_index asc").Find(&ortModels).Error; err != nil {
		return nil, err
	}

	orte := make([]*iface.Ort, len(ortModels))
	for i, ort := range ortModels {
		orte[i] = db.ToIfaceOrt(&ort)
	}

	return orte, nil
}

// Einzelnen Ort abrufen
func (s *OrtService) GetByID(id string) (*iface.Ort, error) {
	ortModel, err := s.SearchOrt(id)
	if err != nil {
		return nil, err
	}

	ort := db.ToIfaceOrt(ortModel)

	return ort, nil
}

func (s *OrtService) getLastSortIndex() (int, error) {
	var ort models.Ort

	if err := s.db.Order("sort_index desc").First(&ort).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, nil
		}
		return 0, err
	}
	return ort.SortIndex, nil
}

// Neuen Ort erstellen
func (s *OrtService) Create(data iface.OrtData) (*iface.Ort, error) {
	lastIndex, err := s.getLastSortIndex()
	if err != nil {
		return nil, err
	}

	ortModel := &models.Ort{
		OrtID:     utils.NewOrtID(),
		Name:      data.Name,
		SortIndex: lastIndex + 1,
	}

	if err := s.db.Create(ortModel).Error; err != nil {
		return nil, err
	}

	ort := db.ToIfaceOrt(ortModel)

	return ort, nil
}

// Ort aktualisieren
func (s *OrtService) Update(id string, data iface.OrtData) (*iface.Ort, error) {
	// Ort aus DB abrufen
	ort, err := s.SearchOrt(id)
	if err != nil {
		return nil, err
	}

	// Felder aktualisieren
	ort.Name = data.Name

	// Änderungen speichern
	if err := s.db.Save(&ort).Error; err != nil {
		return nil, err
	}

	updated := db.ToIfaceOrt(ort)

	return updated, nil
}

// Ort entfernen
func (s *OrtService) Delete(id string) error {
	result := s.db.Delete(&models.Ort{}, "ort_id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("ort not found")
	}

	return nil
}

// Reihenfolge aktualisieren
func (s *OrtService) UpdateSort(data []iface.SortRequest) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		for _, item := range data {
			// Spule aus DB abrufen
			result := tx.Model(&models.Ort{}).
				Where("ort_id = ?", item.ID).
				Updates(map[string]interface{}{
					"sort_index": item.SortIndex,
				})

			if result.Error != nil {
				return result.Error
			}
		}
		return nil
	})
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *OrtService) SearchOrt(id string) (*models.Ort, error) {
	var ort models.Ort

	if err := s.db.First(&ort, "ort_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("material not found")
		}
		return nil, err
	}

	return &ort, nil
}
