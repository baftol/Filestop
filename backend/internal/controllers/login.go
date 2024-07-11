package controllers

import (
	"encoding/json"
	"filestop-backend/internal/config"
	"filestop-backend/internal/helpers"
	"filestop-backend/internal/models"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type UserLoginResponse struct {
	Token            string `json:"token"`
	EncryptedPrivKey string `json:"encrypted_priv_key"`
	Message          string `json:"message"`
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var req UserLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, err := models.GetUserByUsername(config.UserDB, req.Username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}
	token, err := helpers.GenerateJWT(req.Username)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(10 * time.Minute),
	})
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(UserLoginResponse{
		Token:            token,
		EncryptedPrivKey: user.EncryptedPrivKey,
		Message:          "Login successful",
	})
}
