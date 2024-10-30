# Commande pour démarrer les conteneurs en arrière-plan
up:
	docker-compose up -d --build

# Commande pour arrêter les conteneurs
down:
	docker-compose down

# Commande pour afficher les logs du conteneur de l’application en continu
logs:
	docker-compose logs -f app

# Commande pour arrêter, reconstruire et démarrer les conteneurs
rebuild:
	docker-compose down
	docker-compose up -d --build
