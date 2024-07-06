package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

// File represents the metadata and access information for an uploaded file.
type File struct {
	ID                int64             `json:"id"`
	FileName          string            `json:"file_name"`
	URLPath           string            `json:"url_path"`
	FilePath          string            `json:"file_path"`
	UploadedAt        time.Time         `json:"uploaded_at"`
	UploadedBy        string            `json:"uploaded_by"`
	IsAnonymous       bool              `json:"is_anonymous"`
	AccessMap         map[string]string `json:"access_map"`
	EncryptedMetadata []byte            `json:"encrypted_metadata"`
}

// CreateFile inserts a new file record into the database.
func CreateFile(db *sql.DB, file *File) error {
	accessMapJSON, err := json.Marshal(file.AccessMap)
	if err != nil {
		return err
	}
	query := `INSERT INTO files (file_name, url_path, file_path, uploaded_at, uploaded_by, is_anonymous, access_map, encrypted_metadata) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return db.QueryRow(query, file.FileName, file.URLPath, file.FilePath, file.UploadedAt, file.UploadedBy, file.IsAnonymous, accessMapJSON, file.EncryptedMetadata).Scan(&file.ID)
}

// GetFile retrieves a file record from the database by its URL path.
func GetFile(db *sql.DB, urlPath string) (*File, error) {
	query := `SELECT id, file_name, url_path, file_path, uploaded_at, uploaded_by, is_anonymous, access_map, encrypted_metadata FROM files WHERE url_path = $1`
	row := db.QueryRow(query, urlPath)

	var file File
	var accessMap []byte
	if err := row.Scan(&file.ID, &file.FileName, &file.URLPath, &file.FilePath, &file.UploadedAt, &file.UploadedBy, &file.IsAnonymous, &accessMap, &file.EncryptedMetadata); err != nil {
		return nil, err
	}

	// Unmarshal the JSON access map
	if err := json.Unmarshal(accessMap, &file.AccessMap); err != nil {
		return nil, err
	}

	return &file, nil
}
