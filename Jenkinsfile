pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        IP = credentials('IP') 
        SSH_USER = 'kifiya'
        MONGO_DOCKER_COMPOSE_DIR = '/home/kifiya/mongodb' 
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm 
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

        /*
        stage('Deploy to VM using Docker Compose') {
            steps {
                script {
                    echo 'Deploying to VM using Docker Compose...'

                    sshagent(['Pipeline SSH']) { // Use the ID of the SSH key credential
                        sh """
                            set -e

                            # Save Docker images as tar files
                            echo 'Saving Docker images...'
                            docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar
                            docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar
                            
                            # Copy tar files to the VM
                            echo 'Copying Docker images to the VM...'
                            scp backend.tar frontend.tar ${SSH_USER}@${IP}:/tmp
                            
                            # SSH into the VM to handle deployment
                            ssh ${SSH_USER}@${IP} << 'EOF'
                                set -e
                                echo 'Starting deployment on VM...'

                                # Navigate to Docker Compose directory
                                if [ ! -d "${MONGO_DOCKER_COMPOSE_DIR}" ]; then
                                    echo "Error: Directory ${MONGO_DOCKER_COMPOSE_DIR} does not exist."
                                    exit 1
                                fi
                                cd ${MONGO_DOCKER_COMPOSE_DIR}

                                # Load Docker images
                                echo 'Loading Docker images...'
                                docker load -i /tmp/backend.tar
                                docker load -i /tmp/frontend.tar

                                # Update docker-compose.yml with correct image names
                                echo 'Updating Docker Compose file...'
                                sed -i 's|image: .*mern-todo-app-backend.*|image: mern-todo-app-backend|' docker-compose.yml
                                sed -i 's|image: .*mern-todo-app-frontend.*|image: mern-todo-app-frontend|' docker-compose.yml

                                # Stop and remove existing containers
                                echo 'Stopping existing containers (if any)...'
                                docker-compose down || true  # Stop and remove containers (ignore errors if none exist)

                                # Start the services with the newly loaded images
                                echo 'Starting new containers...'
                                docker-compose up -d --no-build --remove-orphans
EOF
                        """
                    }
                }
            }
        }
        */
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
