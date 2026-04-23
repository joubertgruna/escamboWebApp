# =============================================
# Módulo VPC
# =============================================
module "vpc" {
  source = "./modules/vpc"

  project_name    = var.project_name
  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  aws_region      = var.aws_region
}

# =============================================
# Módulo S3
# =============================================
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}

# =============================================
# Módulo RDS (MySQL)
# =============================================
module "rds" {
  source = "./modules/rds"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  db_instance_class = var.db_instance_class
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = var.db_password
  ec2_security_group_id = module.ec2.security_group_id
}

# =============================================
# Módulo EC2
# =============================================
module "ec2" {
  source = "./modules/ec2"

  project_name     = var.project_name
  environment      = var.environment
  vpc_id           = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_ids[0]
  instance_type    = var.ec2_instance_type
  key_name         = var.ec2_key_name
}

# =============================================
# Módulo CloudFront
# =============================================
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name          = var.project_name
  environment           = var.environment
  s3_bucket_domain_name = module.s3.bucket_regional_domain_name
  s3_bucket_id          = module.s3.bucket_id
  ec2_public_dns        = module.ec2.public_dns
}

# =============================================
# Módulo IAM
# =============================================
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
  s3_bucket_arn = module.s3.bucket_arn
}
