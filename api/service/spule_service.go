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

	if err := s.db.Order("sort_index ASC").Preload("Filament").Preload("Filament.Hersteller").Preload("Filament.Material").Preload("Ort").Find(&spulenModels).Error; err != nil {
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

	// if err := s.db.First(&models.Ort{}, "ort_id = ?", data.OrtID).Error; err != nil {
	// 	return nil, errors.New("ort not found")
	// }

	spuleModel := &models.Spule{
		SpuleID:              utils.NewSpulenID(),
		FilamentID:           data.FilamentID,
		Verbrauchtes_Gewicht: data.Verbrauchtes_Gewicht,
		NFC:                  data.NFC,
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
	spule, err := s.SearchSpuleWithoutPreload(id)
	if err != nil {
		return nil, err
	}

	if err := s.db.First(&models.Filament{}, "filament_id = ?", data.FilamentID).Error; err != nil {
		return nil, errors.New("filament not found")
	}

	if err := s.db.First(&models.Ort{}, "ort_id = ?", data.OrtID).Error; err != nil {
		return nil, errors.New("ort not found")
	}

	// Felder aktualisieren
	spule.FilamentID = data.FilamentID
	spule.Verbrauchtes_Gewicht = data.Verbrauchtes_Gewicht
	spule.NFC = data.NFC
	spule.OrtID = &data.OrtID
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

// Archiv-Status aktualisieren
func (s *SpuleService) UpdateArchiv(id string, data iface.ArchivRequest) (*iface.Spule, error) {

	updates := map[string]interface{}{
		"archiviert": data.Archiviert,
	}

	if data.Archiviert {
		updates["nfc"] = nil
		updates["nummer"] = nil
		updates["ort_id"] = nil
	}

	// Spule aus DB abrufen
	result := s.db.Model(&models.Spule{}).
		Where("spule_id = ?", id).
		Updates(updates)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, errors.New("spule not found")
	}

	spule, err := s.SearchSpule(id)
	if err != nil {
		return nil, err
	}
	updated := db.ToIfaceSpule(spule)

	return updated, nil
}

// Ort aktualisieren
func (s *SpuleService) UpdateOrt(id string, data iface.OrtRequest) (*iface.Spule, error) {

	if data.OrtID != nil {
		if err := s.db.First(&models.Ort{}, "ort_id = ?", data.OrtID).Error; err != nil {
			return nil, errors.New("ort not found")
		}
	}

	// Spule aus DB abrufen
	result := s.db.Model(&models.Spule{}).
		Where("spule_id = ?", id).
		Update("ort_id", data.OrtID)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, errors.New("spule not found")
	}

	spule, err := s.SearchSpule(id)
	if err != nil {
		return nil, err
	}
	updated := db.ToIfaceSpule(spule)

	return updated, nil
}

// Ort aktualisieren
func (s *SpuleService) UpdateSort(data []iface.SpulenSortRequest) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		for _, item := range data {
			if item.OrtID != nil {
				if err := tx.First(&models.Ort{}, "ort_id = ?", *item.OrtID).Error; err != nil {
					return errors.New("ort not found")
				}
			}

			// Spule aus DB abrufen
			result := tx.Model(&models.Spule{}).
				Where("spule_id = ?", item.ID).
				Updates(map[string]interface{}{
					"ort_id":     item.OrtID,
					"sort_index": item.SortIndex,
				})

			if result.Error != nil {
				return result.Error
			}
		}
		return nil
	})
}

// NFC-Tag & Nummer entfernen
func (s *SpuleService) RemoveNfc(id string, data iface.NfcRemoveRequest) (*iface.Spule, error) {
	updates := map[string]interface{}{}

	if data.NFC == nil {
		updates["nfc"] = data.NFC
	}

	if data.Nummer == nil {
		updates["nummer"] = data.Nummer
	}

	if len(updates) == 0 {
		return nil, errors.New("no Update")
	}

	// Spule aus DB abrufen
	result := s.db.Model(&models.Spule{}).
		Where("spule_id = ?", id).
		Updates(updates)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, errors.New("spule not found")
	}

	spule, err := s.SearchSpule(id)
	if err != nil {
		return nil, err
	}
	updated := db.ToIfaceSpule(spule)

	return updated, nil
}

// Nummer aktualisieren
func (s *SpuleService) UpdateNummer(id string, data iface.NummerRequest) (*iface.Spule, error) {
	updates := map[string]interface{}{}
	updates["nummer"] = data.Nummer

	if len(updates) == 0 {
		return nil, errors.New("no Update")
	}

	// Spule aus DB abrufen
	result := s.db.Model(&models.Spule{}).
		Where("spule_id = ?", id).
		Updates(updates)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, errors.New("spule not found")
	}

	spule, err := s.SearchSpule(id)
	if err != nil {
		return nil, err
	}
	updated := db.ToIfaceSpule(spule)

	return updated, nil
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

func (s *SpuleService) SearchSpuleWithoutPreload(id string) (*models.Spule, error) {
	var spule models.Spule

	if err := s.db.First(&spule, "spule_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("spule not found")
		}
		return nil, err
	}

	return &spule, nil
}

func (s *SpuleService) SearchSpuleByTag(nfcTag string) (*models.Spule, error) {
	var spule models.Spule

	if err := s.db.Preload("Filament").Preload("Filament.Hersteller").Preload("Filament.Material").Preload("Ort").First(&spule, "nfc = ?", nfcTag).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("spule not found")
		}
		return nil, err
	}

	return &spule, nil
}
