pipeline {
    agent { label 'agent1' }

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        VM_IP = '10.254.99.54'
        SSH_USER = 'kifiya'
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm // This will pull code from the configured repository
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
                    // Copy Docker images to the VM and run them using SSH
                    sh '''
                        # Save backend and frontend images as tar files
                        docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar
                        docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar
                        
                        # Copy images to the VM
                        scp backend.tar frontend.tar ${SSH_USER}@${VM_IP}:/tmp
                        
                        # SSH into the VM, load images and run containers
                        ssh ${SSH_USER}@${VM_IP} '
                            docker load -i /tmp/backend.tar
                            docker load -i /tmp/frontend.tar
                            
                            # Stop and remove existing containers if any
                            docker-compose down || true
                            
                            # Start the new backend and frontend containers
                            docker run -d -p 5000:5000 ${BACKEND_DOCKER_IMAGE}
                            docker run -d -p 80:80 ${FRONTEND_DOCKER_IMAGE}
                        '
                    '''
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
