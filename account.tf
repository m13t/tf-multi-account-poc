module "account" {
  source  = "terraform-framework/account/aws"
  version = "0.3.0-rc.2"

  // Config files are located in the accounts directory
  local_config_path = "accounts"

  // Config is grouped by partnerns, so we add a named
  // placeholder which will be extracted and added as a
  // tag
  local_config_subpath = "{partner}"

  // Track the git org and repo
  track_git = true

  // Add custom tags to all resources
  tags = {
    Generation = 2
  }
}
