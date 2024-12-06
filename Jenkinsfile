pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'backend-image:latest'
        FRONTEND_DOCKER_IMAGE = 'frontend-image:latest'
        SSH_KEY_PATH = '/path/to/your/private/key'
        SSH_USER = 'your_vm_user'
        VM_IP = 'your_vm_ip'
        MONGO_DOCKER_COMPOSE_DIR = '/home/kifiya/mongodb'
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    echo 'Building backend...'
                    // Build backend code if necessary
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building frontend...'
                    // Build frontend code if necessary
                }
            }
        }

        stage('Dockerize Backend and Frontend') {
            steps {
                script {
                    echo 'Dockerizing backend and frontend...'
                    sh """
                        # Build backend Docker image
                        docker build -t ${BACKEND_DOCKER_IMAGE} ./backend
                        
                        # Build frontend Docker image
                        docker build -t ${FRONTEND_DOCKER_IMAGE} ./frontend
                    """
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    echo 'Deploying to VM...'
                    sh """
                        # Save Docker images as tar files
                        docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar
                        docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar
                        
                        # Copy tar files to the VM
                        scp -i ${SSH_KEY_PATH} backend.tar frontend.tar ${SSH_USER}@${VM_IP}:/tmp
                        
                        # SSH into the VM to handle deployment
                        ssh -i ${SSH_KEY_PATH} ${SSH_USER}@${VM_IP} << 'EOF'
                            set -e
                            echo 'Starting deployment on VM...'
                            
                            # Navigate to MongoDB Docker Compose directory
                            cd ${MONGO_DOCKER_COMPOSE_DIR}
                            
                            # Restart MongoDB using docker-compose
                            docker-compose down || true
                            docker-compose up -d
                            
                            # Load Docker images on the VM
                            docker load -i /tmp/backend.tar
                            docker load -i /tmp/frontend.tar
                            
                            # Stop and remove containers using conflicting ports
                            echo 'Stopping conflicting containers...'
                            docker ps --filter "publish=5000" --filter "publish=80" --quiet | xargs --no-run-if-empty docker stop
                            docker ps --filter "publish=5000" --filter "publish=80" --quiet | xargs --no-run-if-empty docker rm
                            
                            # Stop and remove containers by name
                            docker ps -a --filter "name=backend-container" --quiet | xargs --no-run-if-empty docker stop
                            docker ps -a --filter "name=backend-container" --quiet | xargs --no-run-if-empty docker rm
                            docker ps -a --filter "name=frontend-container" --quiet | xargs --no-run-if-empty docker stop
                            docker ps -a --filter "name=frontend-container" --quiet | xargs --no-run-if-empty docker rm
                            
                            # Confirm ports are free
                            echo 'Checking port availability...'
                            netstat -tuln | grep ':5000' && echo "Port 5000 is in use!" || echo "Port 5000 is free."
                            netstat -tuln | grep ':80' && echo "Port 80 is in use!" || echo "Port 80 is free."
                            
                            # Start new backend and frontend containers
                            echo 'Starting new containers...'
                            docker run -d --name backend-container -p 5000:5000 ${BACKEND_DOCKER_IMAGE}
                            docker run -d --name frontend-container -p 80:80 ${FRONTEND_DOCKER_IMAGE}
                        EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}
