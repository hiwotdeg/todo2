pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        VM_IP = '10.254.99.54'
        SSH_USER = 'kifiya'
        SSH_KEY_PATH = '/var/jenkins_home/.ssh/id_rsa' // Path to the private SSH key
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
                        // Build backend Docker image
                        sh 'docker build -t ${BACKEND_DOCKER_IMAGE} .'
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                dir('TODO/todo_frontend') {
                    script {
                        // Build frontend Docker image
                        sh 'docker build -t ${FRONTEND_DOCKER_IMAGE} .'
                    }
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    sh """
                        # Save backend and frontend images as tar files
                        docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar
                        docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar
                        
                        # Copy images to the VM
                        scp -i ${SSH_KEY_PATH} backend.tar frontend.tar ${SSH_USER}@${VM_IP}:/tmp
                        
                        # SSH into the VM to deploy the app
                        ssh -i ${SSH_KEY_PATH} ${SSH_USER}@${VM_IP} << 'EOF'
                            # Navigate to the MongoDB Docker Compose directory
                            cd /home/kifiya/mongodb
                            
                            # Bring up MongoDB container
                            docker-compose down || true
                            docker-compose up -d
                            
                            # Load Docker images on the VM
                            docker load -i /tmp/backend.tar
                            docker load -i /tmp/frontend.tar
                            
                            # Clean up existing containers using the required ports
                            docker ps --filter "publish=5000" --filter "publish=80" --quiet | xargs --no-run-if-empty docker stop
                            docker ps --filter "publish=5000" --filter "publish=80" --quiet | xargs --no-run-if-empty docker rm
                            
                            # Start the new backend and frontend containers
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
            cleanWs() // Clean the workspace after the build
        }
    }
}
