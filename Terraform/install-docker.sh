#!/bin/bash
apt-get update
apt-get install -y docker.io docker-compose-v2
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# Clone and deploy application
git clone https://github.com/yourusername/mern-employee-manager.git /home/ubuntu/app
cd /home/ubuntu/app
docker compose up -d
