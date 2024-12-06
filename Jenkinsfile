pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        VM_IP = '10.254.99.54'
        SSH_USER = 'kifiya'
        SSH_KEY_PATH = '/var/jenkins_home/.ssh/id_rsa' // Path to the private SSH key
        MONGO_DOCKER_COMPOSE_DIR = '/home/kifiya/mongodb' // Path to MongoDB docker-compose.yml on the VM
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm // Pulls code from the configured repository
            }
        }

        stage('Build Docker Image - Backend') {
            steps {
                dir('TODO/todo_backend') {
                    script {
                        echo 'Building backend Docker image...'
                        sh 'docker build -t ${BACKEND_DOCKER_IMAGE} .'
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                dir('TODO/todo_frontend') {
                    script {
                        echo 'Building frontend Docker image...'
                        sh 'docker build -t ${FRONTEND_DOCKER_IMAGE} .'
                    }
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
                            
                            # Clean up containers using conflicting ports
                            echo 'Stopping any container using port 5000 or 80...'
                            docker ps --filter "publish=5000" --filter "publish=80" --quiet | xargs --no-run-if-empty docker stop
                            docker ps --filter "publish=5000" --filter "publish=80" --quiet | xargs --no-run-if-empty docker rm
                            
                            # Remove conflicting containers by name
                            docker ps -a --filter "name=backend-container" --quiet | xargs --no-run-if-empty docker stop
                            docker ps -a --filter "name=backend-container" --quiet | xargs --no-run-if-empty docker rm
                            docker ps -a --filter "name=frontend-container" --quiet | xargs --no-run-if-empty docker stop
                            docker ps -a --filter "name=frontend-container" --quiet | xargs --no-run-if-empty docker rm
                            
                            # Check if ports are free
                            ss -tuln | grep ':5000' && echo "Port 5000 is in use!" || echo "Port 5000 is free."
                            ss -tuln | grep ':80' && echo "Port 80 is in use!" || echo "Port 80 is free."
                            
                            # Start new backend and frontend containers
                            docker run -d --name backend-container -p 5000:5000 ${BACKEND_DOCKER_IMAGE}
                            docker run -d --name frontend-container -p 80:80 ${FRONTEND_DOCKER_IMAGE}
                        EOF
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
