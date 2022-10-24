terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.36"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }

    http = {
      source  = "hashicorp/http"
      version = "~> 3.1"
    }

    git = {
      source  = "metio/git"
      version = "2022.9.30"
    }
  }
}

provider "aws" {
  region = "eu-west-2"
}
