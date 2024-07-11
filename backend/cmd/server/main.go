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

	config.RedisStart()
	config.InitializeRedis()

	r := mux.NewRouter()

	r.HandleFunc("/upload", controllers.UploadFile).Methods("POST")
	r.HandleFunc("/register", controllers.RegisterUser).Methods("POST")
	r.HandleFunc("/login", controllers.LoginUser).Methods("POST")
	r.HandleFunc("/users", controllers.SearchUsers).Methods("GET")
	// staticDir := filepath.Join("..", "..", "..", "frontend", "build")
	// r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(filepath.Join(staticDir, "static")))))
	//
	// r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	indexPath := filepath.Join(staticDir, "index.html")
	// 	http.ServeFile(w, r, indexPath)
	// })
	fmt.Println("Starting server on :3000...")
	log.Fatal(http.ListenAndServe(":3000", r))
}
