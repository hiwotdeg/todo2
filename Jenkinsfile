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
                        sh """
                            docker build -t ${BACKEND_DOCKER_IMAGE} .
                        """
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                dir('TODO/todo_frontend') {
                    script {
                        echo 'Building frontend Docker image...'
                        sh """
                            docker build -t ${FRONTEND_DOCKER_IMAGE} .
                        """
                    }
                }
            }
        }

        stage('Deploy to VM using Docker Compose') {
            steps {
                script {
                    echo 'Deploying to VM using Docker Compose...'

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

                            # Navigate to Docker Compose directory
                            cd ${MONGO_DOCKER_COMPOSE_DIR}

                            # Load Docker images
                            docker load -i /tmp/backend.tar
                            docker load -i /tmp/frontend.tar

                            # Update docker-compose.yml with correct image names (no tag, use default)
                            sed -i 's|image: .*mern-todo-app-backend.*|image: mern-todo-app-backend|' docker-compose.yml
                            sed -i 's|image: .*mern-todo-app-frontend.*|image: mern-todo-app-frontend|' docker-compose.yml

                            # Stop and remove existing containers
                            docker-compose down || true  # Stop and remove containers (if any)

                            # Start the services with the newly loaded images
                            docker-compose up -d --no-build --remove-orphans  # Use --no-build to avoid rebuilding the images
EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed. Check the logs for details.'
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
