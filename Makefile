OS     := $(shell uname -s)
SHELL  := /bin/bash

IMAGE_NAME     := webcam-demo
CONTAINER_NAME := webcam-demo

GCP_SERVICE_NAME := webcam-demo
GCP_PROJECT_ID   := mickaelvieira
GCP_IMAGE        := gcr.io/$(GCP_PROJECT_ID)/$(IMAGE_NAME)

build:
	yarn
	yarn build:js

build-go:
	GOOS=js GOARCH=wasm go build -o public/main.wasm

# Building using Cloud Build
build-prod:
	gcloud builds submit --tag $(GCP_IMAGE)

deploy-prod:
	gcloud run deploy $(GCP_SERVICE_NAME) --platform managed --allow-unauthenticated --region europe-west1 --image $(GCP_IMAGE)

watch:
	yarn watch:js

lint:
	yarn lint:js

fmt:
	yarn lint:js:fix

docker-build:
	docker build --rm --tag $(GCP_IMAGE) .

docker-push:
	 docker push $(GCP_IMAGE)

docker-run:
	docker run --tty --publish 8080:8080 --name $(CONTAINER_NAME) --rm $(GCP_IMAGE)

docker-stop:
	docker stop $(CONTAINER_NAME)

docker-ssh:
	docker exec -it $(CONTAINER_NAME) /bin/sh
