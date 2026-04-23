output "vpc_id" {
  description = "ID da VPC"
  value       = module.vpc.vpc_id
}

output "ec2_public_ip" {
  description = "IP público da EC2"
  value       = module.ec2.public_ip
}

output "rds_endpoint" {
  description = "Endpoint do RDS"
  value       = module.rds.endpoint
}

output "s3_bucket_name" {
  description = "Nome do bucket S3"
  value       = module.s3.bucket_name
}

output "cloudfront_domain" {
  description = "Domínio do CloudFront"
  value       = module.cloudfront.domain_name
}
