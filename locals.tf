locals {
  // Computed property for using in lookups
  partner = format(
    "%s-%s",
    module.account.groups.partner,
    module.account.env.name,
  )

  // Load values for current partner and environment
  config = yamldecode(file(format(
    "%s/config/%s.yaml",
    path.root,
    local.partner,
  )))
}
