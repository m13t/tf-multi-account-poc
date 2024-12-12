locals {
  // Get the first CIDR
  vpc_primary_cidr = element(module.account.env.network.cidr_blocks, 0)

  // Get any additional CIDRs
  vpc_secondary_cidrs = toset([
    for block in module.account.env.network.cidr_blocks :
    block if block != local.vpc_primary_cidr
  ])
}

// Create VPC for our environment
resource "aws_vpc" "vpc" {
  // Address range for VPC
  cidr_block = local.vpc_primary_cidr

  // Enable DNS supprt per partner
  enable_dns_support = local.config.enable_dns_support

  // Enable DNS hostnames per partner
  enable_dns_hostnames = local.config.enable_dns_hostnames

  // Inject account tags
  tags = merge(module.account.tags, {
    // Format name tag using account format
    Name = format(module.account.tag_name.format, "VPC")
  })
}

// Add any additional CIDR ranges
resource "aws_vpc_ipv4_cidr_block_association" "additional" {
  for_each = local.vpc_secondary_cidrs

  vpc_id     = aws_vpc.vpc.id
  cidr_block = each.key
}

resource "aws_s3_bucket" "assets" {
  bucket = format(
    "%s-assets",
    join("-", reverse(split(".", module.account.env.domain))),
  )

  tags = merge(module.account.tags, {
    Name = format(module.account.tag_name.format, "ASSETS")
  })
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = lookup(local.config, "block_public_acls", false)
  block_public_policy     = lookup(local.config, "block_public_policy", false)
  ignore_public_acls      = lookup(local.config, "ignore_public_acls", false)
  restrict_public_buckets = lookup(local.config, "restrict_public_buckets", false)
}
