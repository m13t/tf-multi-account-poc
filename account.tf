module "account" {
  source  = "terraform-framework/account/aws"
  version = "0.3.0-rc.1"

  // Config files are located in the accounts directory
  local_config_path = "accounts"

  // Config is grouped by partnerns, so we add a named
  // placeholder which will be extracted and added as a
  // tag
  local_config_subpath = "{partner}"
}
