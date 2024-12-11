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
    Version = 3
  })
}

// Add any additional CIDR ranges
resource "aws_vpc_ipv4_cidr_block_association" "additional" {
  for_each = local.vpc_secondary_cidrs

  vpc_id     = aws_vpc.vpc.id
  cidr_block = each.key
}
