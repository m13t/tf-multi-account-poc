terraform {
  backend "s3" {
    bucket = "io.m13t.terraform-state"
    region = "eu-west-2"
  }
}
