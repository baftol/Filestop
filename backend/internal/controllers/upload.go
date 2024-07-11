package controllers

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"filestop-backend/internal/config"
	"filestop-backend/internal/models"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

type FileUploadRequest struct {
	FileName          string   `json:"filename"`
	Content           []byte   `json:"content"`
	SharedWith        []string `json:"shared_with"` // Usernames
	Anonymous         bool     `json:"anonymous"`
	Username          string   `json:"username"`
	EncryptedMetadata []byte   `json:"encrypted_metadata"`
}

type FileUploadResponse struct {
	URLPath string `json:"url_path"`
	Message string `json:"message"`
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	var req FileUploadRequest
	w.WriteHeader(http.StatusOK)
	return
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	urlPath := uuid.New().String()
	encryptedFilePath := filepath.Join("uploads", urlPath)

	symKey := make([]byte, 32) // AES-256
	if _, err := rand.Read(symKey); err != nil {
		http.Error(w, "Error generating symmetric key", http.StatusInternalServerError)
		return
	}

	// Encrypt the file content

	encryptedContent, err := encryptFileContent(req.Content, symKey)
	if err != nil {
		http.Error(w, "Error encrypting file", http.StatusInternalServerError)
		return
	}
	dir := filepath.Dir(encryptedFilePath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, 0755); err != nil {
			http.Error(w, "Error creating directory", http.StatusInternalServerError)
			return
		}
	}
	// Save the encrypted file
	if err := os.WriteFile(encryptedFilePath, encryptedContent, 0644); err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	accessMap := make(map[string]string)
	for _, username := range req.SharedWith {
		user, err := models.GetUserByUsername(config.UserDB, username)
		if err != nil {
			http.Error(w, fmt.Errorf("Error finding user %v", username).Error(), http.StatusInternalServerError)
			return
		}
		encryptedSymKey, err := encryptSymmetricKey(symKey, user.PublicKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
			http.Error(w, "Error encrypting symmetric key", http.StatusInternalServerError)
			return
		}
		accessMap[username] = encryptedSymKey
	}
	uploadedBy := "anonymous"
	if !req.Anonymous {
		// Replace this with actual user identification logic
		uploadedBy = req.Username // This should be the logged-in user's username
	}

	file := models.File{
		FileName:          req.FileName,
		URLPath:           urlPath,
		FilePath:          encryptedFilePath,
		UploadedAt:        time.Now(),
		UploadedBy:        uploadedBy,
		IsAnonymous:       req.Anonymous,
		AccessMap:         accessMap,
		EncryptedMetadata: req.EncryptedMetadata,
	}

	if err := models.CreateFile(config.FileDB, &file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
		http.Error(w, "Error saving file metadata", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(FileUploadResponse{
		URLPath: urlPath,
		Message: "File uploaded successfully",
	})
}

func encryptFileContent(content []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}

	return gcm.Seal(nonce, nonce, content, nil), nil
}
func encryptSymmetricKey(symKey []byte, publicKey string) (string, error) {
	// Decode the base64 encoded public key
	pubKeyPEM, err := base64.StdEncoding.DecodeString(publicKey)
	if err != nil {
		return "", fmt.Errorf("error decoding base64 public key: %v", err)
	}

	// Decode the PEM block
	block, _ := pem.Decode(pubKeyPEM)
	if block == nil {
		return "", fmt.Errorf("failed to decode PEM block containing public key")
	}

	// Parse the RSA public key
	pubKey, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return "", fmt.Errorf("error parsing public key: %v", err)
	}

	// Encrypt the symmetric key
	encryptedBytes, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, pubKey.(*rsa.PublicKey), symKey, nil)
	if err != nil {
		return "", fmt.Errorf("error encrypting symmetric key: %v", err)
	}

	// Encode the encrypted symmetric key in base64
	return base64.StdEncoding.EncodeToString(encryptedBytes), nil
}
