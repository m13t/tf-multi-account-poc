locals {
  // Per partner environment dns support
  enable_dns_support = {
    // Wiztec
    wiztec-qa   = true
    wiztec-live = false

    // Vaquita
    vaquita-qa   = true
    vaquita-live = true
  }

  // Per partner environment dns hostnames
  enable_dns_hostnames = {
    // Wiztec
    wiztec-qa   = true
    wiztec-live = false

    // Vaquita
    vaquita-qa   = true
    vaquita-live = false
  }
}
