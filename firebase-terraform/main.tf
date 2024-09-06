terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

provider "google-beta" {
  user_project_override = true
}

resource "google_project" "default" {
  provider = google-beta.no_user_project_override

  name            = "binnmti-test-project"
  project_id      = "binnmti-test-project-tf"
  billing_account = "01BAC7-5F2A1E-5E4BE5"

  labels = {
    "firebase" = "enabled"
  }
}

resource "google_project_service" "serviceusage" {
  provider = google-beta.no_user_project_override

  project = google_project.default.project_id
  service = "serviceusage.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "firebase" {
  provider = google-beta.no_user_project_override

  project = google_project.default.project_id
  service = "firebase.googleapis.com"

  disable_on_destroy = false
}

resource "google_firebase_project" "default" {
  provider = google-beta

  project = google_project.default.project_id

  depends_on = [
    google_project_service.firebase,
    google_project_service.serviceusage,
  ]
}

resource "google_firebase_web_app" "default" {
  provider = google-beta

  project         = google_firebase_project.default.project
  display_name    = "binnmti-test-project-webapp"
  deletion_policy = "DELETE"
}

resource "google_project_service" "auth" {
  provider           = google-beta
  project            = google_firebase_project.default.project
  service            = "identitytoolkit.googleapis.com"
  disable_on_destroy = false
}

resource "google_identity_platform_config" "auth" {
  provider                   = google-beta
  project                    = google_firebase_project.default.project
  autodelete_anonymous_users = true
  depends_on = [
    google_project_service.auth,
  ]
}

variable "oauth_client_secret" {
  type        = string
  description = "OAuth client secret. For this codelab, you can pass in this secret through the environment variable TF_VAR_oauth_client_secret. In a real app, you should use a secret manager service."
  sensitive   = true
}

resource "google_identity_platform_default_supported_idp_config" "google_sign_in" {
  provider      = google-beta
  project       = google_firebase_project.default.project
  enabled       = true
  idp_id        = "google.com"
  client_id     = "900573945328-luuuovajg5bk607919ocqch4gah8j8th.apps.googleusercontent.com"
  client_secret = var.oauth_client_secret
  depends_on = [
    google_identity_platform_config.auth
  ]
}

resource "google_project_service" "firestore" {
  provider = google-beta

  project = google_firebase_project.default.project
  for_each = toset([
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
  ])
  service = each.key

  disable_on_destroy = false
}

resource "google_firestore_database" "default" {
  provider = google-beta

  project          = google_firebase_project.default.project
  name             = "(default)"
  location_id      = "asia-northeast2"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "OPTIMISTIC"

  depends_on = [
    google_project_service.firestore
  ]
}

resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta

  project = google_firebase_project.default.project
  source {
    files {
      name    = "firestore.rules"
      content = file("firestore.rules")
    }
  }

  depends_on = [
    google_firestore_database.default,
  ]
}

resource "google_firebaserules_release" "firestore" {
  provider = google-beta

  name         = "cloud.firestore" # must be cloud.firestore
  ruleset_name = google_firebaserules_ruleset.firestore.name
  project      = google_firebase_project.default.project

  depends_on = [
    google_firestore_database.default,
  ]

  lifecycle {
    replace_triggered_by = [
      google_firebaserules_ruleset.firestore
    ]
  }
}

resource "google_app_engine_application" "default" {
  provider = google-beta

  project     = google_firebase_project.default.project
  location_id = "asia-northeast2" # Must be in the same location as Firestore (above)
  depends_on = [
    google_firestore_database.default
  ]
}

resource "google_firebase_storage_bucket" "default-bucket" {
  provider = google-beta

  project   = google_firebase_project.default.project
  bucket_id = google_app_engine_application.default.default_bucket
}

resource "google_firebaserules_ruleset" "storage" {
  provider = google-beta

  project = google_firebase_project.default.project
  source {
    files {
      name    = "storage.rules"
      content = file("storage.rules")
    }
  }

  depends_on = [
    google_firebase_storage_bucket.default-bucket,
  ]
}

resource "google_firebaserules_release" "default-bucket" {
  provider = google-beta

  name         = "firebase.storage/${google_app_engine_application.default.default_bucket}"
  ruleset_name = "projects/${google_firebase_project.default.project}/rulesets/${google_firebaserules_ruleset.storage.name}"
  project      = google_firebase_project.default.project

  lifecycle {
    replace_triggered_by = [
      google_firebaserules_ruleset.storage
    ]
  }
}
