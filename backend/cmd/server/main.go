package main

import (
	"filestop-backend/internal/config"
	"filestop-backend/internal/controllers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file %v", err)
	}
	if err := config.ConnectFileDB(); err != nil {
		log.Fatalf("Failed to connect to file database: %v", err)
	}
	if err := config.ConnectUserDB(); err != nil {
		log.Fatalf("Failed to connect to user database: %v", err)
	}
	defer config.CloseDBs()
	r := mux.NewRouter()
	r.HandleFunc("/upload", controllers.UploadFile).Methods("POST")
	r.HandleFunc("/register", controllers.RegisterUser).Methods("POST")
	r.HandleFunc("/login", controllers.LoginUser).Methods("POST")
	fmt.Println("Starting server on :3000...")
	log.Fatal(http.ListenAndServe(":3000", r))
}
