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

  # name            = "one-pager-maker-staging"
  # project_id      = "one-pager-maker-staging-id"
  name            = "one-pager-maker-production"
  project_id      = "one-pager-maker-production"
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
  display_name    = "one-pager-maker-webapp"
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

resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_firebase_project.default.project
  sign_in {
    allow_duplicate_emails = true
    email {
      enabled           = true
      password_required = true
    }
  }
  depends_on = [
    google_identity_platform_config.auth
  ]
}

variable "oauth_client_id_google" {
  type        = string
  description = "OAuth client id. For this codelab, you can pass in this secret through the environment variable TF_VAR_oauth_client_id. In a real app, you should use a secret manager service."
  sensitive   = true
}

variable "oauth_client_secret_google" {
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
  client_secret = var.oauth_client_secret_google
  depends_on = [
    google_identity_platform_config.auth
  ]
}

variable "oauth_client_id_github" {
  type        = string
  description = "OAuth client id. For this codelab, you can pass in this secret through the environment variable TF_VAR_oauth_client_secret_github. In a real app, you should use a secret manager service."
  sensitive   = true
}

variable "oauth_client_secret_github" {
  type        = string
  description = "OAuth client secret. For this codelab, you can pass in this secret through the environment variable TF_VAR_oauth_client_secret_github. In a real app, you should use a secret manager service."
  sensitive   = true
}

# githubのclient_id to client_secret
resource "google_identity_platform_default_supported_idp_config" "github_sign_in" {
  provider      = google-beta
  project       = google_firebase_project.default.project
  enabled       = true
  idp_id        = "github.com"
  client_id     = "Ov23lirVDPHp9Vx8xeOy"
  client_secret = var.oauth_client_secret_github
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

resource "google_firestore_backup_schedule" "weekly-backup" {
  project   = google_firebase_project.default.project
  retention = "8467200s" // 14 weeks (maximum possible retention)

  weekly_recurrence {
    day = "SUNDAY"
  }
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

resource "google_firestore_index" "view_histories_index" {
  project    = google_firebase_project.default.project
  collection = "viewHistories"
  fields {
    field_path = "document.deleted_at"
    order      = "ASCENDING"
  }
  fields {
    field_path = "viewType"
    order      = "ASCENDING"
  }
  fields {
    field_path = "updated_at"
    order      = "DESCENDING"
  }
  fields {
    field_path = "__name__"
    order      = "DESCENDING"
  }
}

resource "google_project_service" "storage" {
  provider = google-beta

  project = google_firebase_project.default.project
  for_each = toset([
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
  ])
  service = each.key

  disable_on_destroy = false
}

resource "google_app_engine_application" "default" {
  provider = google-beta

  project     = google_firebase_project.default.project
  location_id = "asia-northeast2"

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
