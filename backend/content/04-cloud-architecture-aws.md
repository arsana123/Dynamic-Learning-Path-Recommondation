---
title: Cloud Architecture with AWS
description: Design scalable and resilient cloud solutions using Amazon Web Services. Learn IAM, EC2, VPC networking, S3, databases and the principles of highly available architecture.
difficulty: Intermediate
duration: 8 weeks
instructor: Emily Watson
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop
tags: AWS, Cloud, DevOps
rating: 4.6
ratingsCount: 142
enrolledCount: 1420
price: 119
discountPrice: 69
prerequisites: Data Structures & Algorithms
---

# LESSON: Introduction to AWS | 25 min

## What is cloud computing?

Instead of buying and maintaining servers, you **rent** computing resources over the internet and pay only for what you use. **Amazon Web Services (AWS)** is the largest cloud provider, with dozens of services across the globe.

## Benefits

- **Pay-as-you-go** - no big upfront hardware cost
- **Elasticity** - scale up for traffic spikes and down afterwards
- **Global reach** - deploy close to your users
- **Reliability** - built-in redundancy

## Global infrastructure

| Concept | Meaning |
|---|---|
| **Region** | A geographic area (e.g. `ap-south-1` Mumbai, `us-east-1` N. Virginia) |
| **Availability Zone (AZ)** | One or more separate data centres inside a Region |
| **Edge location** | Used by CloudFront to cache content close to users |

Spreading resources across **multiple AZs** protects you if one data centre fails.

## Core service categories

- **Compute:** EC2, Lambda, ECS/EKS
- **Storage:** S3, EBS, EFS
- **Database:** RDS, DynamoDB, Aurora
- **Networking:** VPC, Route 53, CloudFront, ELB
- **Security:** IAM, KMS

## Shared responsibility model

AWS is responsible for security **of** the cloud (hardware, facilities, hypervisor). **You** are responsible for security **in** the cloud (your data, access rules, OS patches on EC2, firewall settings).

## Getting started safely

1. Create an AWS account and **enable MFA on the root user**.
2. Never use the root user daily - create an IAM user or role instead.
3. Set up a **billing alarm** (AWS Budgets) so a mistake never becomes an expensive surprise.
4. Start with the **Free Tier** to practise.

# LESSON: IAM - Identity and Access Management | 30 min

IAM controls **who** can do **what** on **which** resources.

## Building blocks

- **User** - a person or application with long-term credentials
- **Group** - a collection of users sharing permissions
- **Role** - a set of permissions that can be *assumed* temporarily (by an EC2 instance, Lambda function or another account)
- **Policy** - a JSON document defining permissions

## A policy example

This policy allows reading objects from one S3 bucket only:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-app-bucket",
        "arn:aws:s3:::my-app-bucket/*"
      ]
    }
  ]
}
```

## Key principles

1. **Least privilege** - grant only the permissions needed, nothing more.
2. **Use roles, not access keys, for applications.** An EC2 instance with a role needs no secret keys stored on disk.
3. **Enable MFA** for all human users, especially admins.
4. **Never commit access keys** to GitHub.
5. An explicit **Deny** always overrides an Allow.

## Using the CLI

```bash
aws configure                 # enter access key, secret, default region
aws sts get-caller-identity   # who am I?
aws s3 ls                     # list buckets
```

# LESSON: EC2 and VPC | 40 min

## EC2 - virtual servers

An **EC2 instance** is a virtual machine. You choose:

- **AMI** - the OS image (Amazon Linux, Ubuntu...)
- **Instance type** - CPU/memory size, e.g. `t3.micro` (general purpose), `c5.large` (compute), `r5.large` (memory)
- **Storage** - EBS volumes
- **Security group** - the firewall
- **Key pair** - for SSH access

### Pricing models

| Model | Best for |
|---|---|
| On-Demand | Short, unpredictable workloads |
| Reserved / Savings Plans | Steady usage for 1-3 years (large discount) |
| Spot | Fault-tolerant jobs (up to ~90% cheaper, can be interrupted) |

### Launch and connect

```bash
# connect to a Linux instance
chmod 400 my-key.pem
ssh -i my-key.pem ec2-user@<public-ip>

# install and start a web server
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

## VPC - your private network

A **Virtual Private Cloud** is an isolated network in AWS where you define the IP range and layout.

- **CIDR block** - the address range, e.g. `10.0.0.0/16`
- **Subnet** - a slice of the VPC inside one AZ
  - **Public subnet** - has a route to an **Internet Gateway**
  - **Private subnet** - no direct internet route
- **Route table** - rules for where traffic goes
- **NAT Gateway** - lets private instances reach the internet (updates) without being reachable from it

## A typical layout

```
VPC 10.0.0.0/16
 |- Public subnet A (AZ-a)  -> Load balancer, NAT gateway
 |- Public subnet B (AZ-b)  -> Load balancer, NAT gateway
 |- Private subnet A (AZ-a) -> App servers
 |- Private subnet B (AZ-b) -> App servers
 |- Private DB subnets      -> Database
```

## Security groups vs NACLs

| | Security group | Network ACL |
|---|---|---|
| Level | Instance | Subnet |
| State | **Stateful** (return traffic automatic) | Stateless |
| Rules | Allow only | Allow and deny |

Example security group rules: allow `443` from anywhere, allow `22` **only from your IP**, never from `0.0.0.0/0`.

# LESSON: Storage with S3 and EBS | 30 min

## Amazon S3 - object storage

S3 stores **objects** (files) in **buckets**. It is virtually unlimited, extremely durable (11 nines) and accessed over HTTP. Ideal for images, backups, logs, static websites and data lakes.

```bash
aws s3 mb s3://my-unique-bucket-12345
aws s3 cp photo.jpg s3://my-unique-bucket-12345/
aws s3 sync ./build s3://my-unique-bucket-12345 --delete
```

### Storage classes

| Class | Use case |
|---|---|
| Standard | Frequently accessed data |
| Standard-IA | Infrequently accessed, rapid retrieval |
| Glacier | Long-term archive, cheapest |
| Intelligent-Tiering | Unknown or changing access patterns |

### Good practices

- **Block public access** unless the bucket truly hosts a public site.
- Turn on **versioning** to recover from accidental deletes.
- Use **lifecycle rules** to move old objects to cheaper classes automatically.
- Encrypt data (S3 does this by default now).

## Amazon EBS - block storage for EC2

An **EBS volume** is like a hard drive attached to one EC2 instance in the same AZ. It persists independently of the instance and supports **snapshots** (backups stored in S3).

## EFS

A managed network file system that **many** instances can mount at the same time.

## Choosing storage

| Need | Choose |
|---|---|
| Files / media / backups, accessed via API | S3 |
| Disk for one server (OS, database) | EBS |
| Shared file system across servers | EFS |

# LESSON: Databases and Serverless | 40 min

## Relational: Amazon RDS

RDS runs MySQL, PostgreSQL, MariaDB, Oracle or SQL Server for you - it handles backups, patching and failover.

- **Multi-AZ** deployment keeps a standby copy in another AZ for automatic failover (high availability).
- **Read replicas** copy data to extra instances to spread read traffic (scaling).
- **Aurora** is AWS's high-performance MySQL/PostgreSQL-compatible engine.

## NoSQL: DynamoDB

A fully managed key-value / document database with single-digit-millisecond latency that scales automatically.

```bash
aws dynamodb put-item --table-name Users \
  --item '{"userId": {"S": "u1"}, "name": {"S": "Asha"}}'

aws dynamodb get-item --table-name Users --key '{"userId": {"S": "u1"}}'
```

Design around your **access patterns** - choose a partition key that spreads load evenly.

## Serverless: AWS Lambda

Run code without managing servers. You upload a function; AWS runs it on demand and charges per millisecond.

```python
# lambda_function.py
import json

def lambda_handler(event, context):
    name = event.get("name", "world")
    return {"statusCode": 200, "body": json.dumps({"message": f"Hello, {name}!"})}
```

Connect Lambda to **API Gateway** to build a REST API with no servers, or trigger it from S3 uploads, queues and schedules.

## SQL or NoSQL?

| Choose RDS when... | Choose DynamoDB when... |
|---|---|
| Data is relational with joins | Access is by key with massive scale |
| You need complex queries | You need predictable low latency |
| Schema is stable | Schema is flexible |

# LESSON: Designing Highly Available Architectures | 45 min

## The goal

Your application should keep working when a server, a data centre, or traffic spikes happen.

## Building blocks

1. **Elastic Load Balancer (ALB)** - spreads incoming requests across healthy instances in multiple AZs.
2. **Auto Scaling Group** - adds or removes EC2 instances automatically based on metrics such as CPU.
3. **Multi-AZ database** - automatic failover.
4. **CloudFront (CDN)** - caches static content at edge locations.
5. **Route 53** - DNS with health checks and failover routing.
6. **S3** - for static assets and uploads, so servers stay stateless.

## Reference architecture

```
Users
  |
Route 53 (DNS)
  |
CloudFront (CDN)  ---- S3 (static files)
  |
Application Load Balancer  (public subnets, 2 AZs)
  |
Auto Scaling Group of EC2 (private subnets, 2 AZs)
  |
RDS Multi-AZ (private DB subnets)
```

## Design principles

- **Remove single points of failure** - always at least two of everything, in different AZs.
- **Keep servers stateless** - store sessions in a shared store (ElastiCache / DynamoDB) and files in S3, so any instance can be replaced.
- **Loose coupling** - use **SQS** queues so that a slow component does not break others.
- **Automate** - infrastructure as code (CloudFormation, Terraform).
- **Monitor** - CloudWatch metrics, logs and alarms.

## The Well-Architected pillars

Operational excellence, Security, Reliability, Performance efficiency, Cost optimisation, Sustainability.

## Cost control checklist

- Right-size instances
- Use Savings Plans for steady workloads
- Delete unused volumes, snapshots and elastic IPs
- Set budgets and alarms
- Shut down dev environments at night

# QUIZ

Q: What is an Availability Zone?
A) A country where AWS operates
B) One or more separate data centres inside a Region
C) A type of EC2 instance
D) A billing plan
ANSWER: B

Q: Under the shared responsibility model, who is responsible for patching the operating system on your EC2 instance?
A) AWS
B) The customer
C) Both equally
D) Neither
ANSWER: B

Q: What is the best way to give an application running on EC2 access to S3?
A) Hard-code access keys in the source code
B) Attach an IAM role to the instance
C) Use the root user credentials
D) Make the bucket public
ANSWER: B

Q: Which subnet type has a route to an Internet Gateway?
A) Private subnet
B) Public subnet
C) Isolated subnet
D) NAT subnet
ANSWER: B

Q: Security groups are:
A) Stateless and apply to subnets
B) Stateful and apply to instances
C) Only able to deny traffic
D) Used to store keys
ANSWER: B

Q: Which storage service is best for hosting images and backups accessed via HTTP?
A) EBS
B) EFS
C) S3
D) Instance store
ANSWER: C

Q: What does enabling Multi-AZ on RDS provide?
A) Cheaper storage
B) Automatic failover to a standby in another AZ
C) Faster writes
D) Free backups forever
ANSWER: B

Q: Which combination best removes a single point of failure for a web tier?
A) One large EC2 instance
B) Load balancer plus Auto Scaling group across multiple AZs
C) One EC2 instance with a bigger disk
D) An S3 bucket
ANSWER: B
