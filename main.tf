resource "aws_vpc" "vpc" {
  // Address range for VPC
  cidr_block = "10.0.0.0/16"

  // We love DNS
  enable_dns_support   = true
  enable_dns_hostnames = true

  // Inject account tags
  tags = merge(module.account.tags, {
    // Format name tag using account format
    Name = format(module.account.tag_name.format, "VPC")
  })
}
