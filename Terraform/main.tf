terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.digitalocean_token
}

# Create VPC
resource "digitalocean_vpc" "employee_vpc" {
  name   = "employee-management-vpc"
  region = var.region
}

# Create Droplet for application
resource "digitalocean_droplet" "app_server" {
  image    = "ubuntu-22-04-x64"
  name     = "employee-management-app"
  region   = var.region
  size     = "s-2vcpu-4gb"
  vpc_uuid = digitalocean_vpc.employee_vpc.id
  
  ssh_keys = [var.ssh_key_fingerprint]
  
  user_data = file("${path.module}/install-docker.sh")
}

# Create managed database
resource "digitalocean_database_cluster" "mongodb" {
  name       = "employee-db"
  engine     = "mongodb"
  version    = "6"
  size       = "db-s-1vcpu-1gb"
  region     = var.region
  node_count = 1
}

# Create Load Balancer
resource "digitalocean_loadbalancer" "app_lb" {
  name   = "employee-app-lb"
  region = var.region
  vpc_uuid = digitalocean_vpc.employee_vpc.id

  forwarding_rule {
    entry_port     = 80
    entry_protocol = "http"
    
    target_port     = 3000
    target_protocol = "http"
  }

  healthcheck {
    port     = 3000
    protocol = "http"
    path     = "/"
  }

  droplet_ids = [digitalocean_droplet.app_server.id]
}
