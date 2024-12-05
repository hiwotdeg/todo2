pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        VM_IP = '10.254.99.54'
        SSH_USER = 'kifiya'
        SSH_KEY_PATH = '/var/jenkins_home/.ssh/id_rsa'  // Path to the private SSH key
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm  // Pull code from the configured repository
            }
        }
        
        stage('Build Docker Image - Backend') {
            steps {
                dir('TODO/todo_backend') {
                    script {
                        echo "Building backend Docker image..."
                        sh "docker build -t ${BACKEND_DOCKER_IMAGE} ."
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                dir('TODO/todo_frontend') {
                    script {
                        echo "Building frontend Docker image..."
                        sh "docker build -t ${FRONTEND_DOCKER_IMAGE} ."
                    }
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    echo "Deploying to VM..."

                    // Save backend and frontend images as tar files
                    sh "docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar"
                    sh "docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar"
                    
                    // Copy images to the VM
                    sh "scp -i ${SSH_KEY_PATH} backend.tar frontend.tar ${SSH_USER}@${VM_IP}:/tmp"
                    
                    // SSH into the VM and run the necessary commands
                    sh """
                        ssh -i ${SSH_KEY_PATH} ${SSH_USER}@${VM_IP} << 'EOF'
                            # Load Docker images
                            docker load -i /tmp/backend.tar
                            docker load -i /tmp/frontend.tar
    
                            # Start the new backend and frontend containers
                            docker run -d -p 5000:5000 ${BACKEND_DOCKER_IMAGE}
                            docker run -d -p 80:80 ${FRONTEND_DOCKER_IMAGE}
                        EOF
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()  // Clean workspace after the build
        }
    }
}
