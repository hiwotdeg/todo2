pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        IP = credentials('IP') // Secret text for VM IP
        SSH_USER = 'kifiya' // Secret text for SSH user
        SSH_KEY = credentials('Pipeline SSH') // SSH private key as Jenkins credential
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
                        sh "docker build -t ${BACKEND_DOCKER_IMAGE} ."
                    }
                }
            }
        }

        stage('Build Docker Image - Frontend') {
            steps {
                dir('TODO/todo_frontend') {
                    script {
                        echo 'Building frontend Docker image...'
                        sh "docker build -t ${FRONTEND_DOCKER_IMAGE} ."
                    }
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'SSH_KEY', keyFileVariable: 'SSH_KEY_PATH', usernameVariable: 'SSH_USER')]) {
                    script {
                        echo "Deploying to VM with IP: ${IP} and user: ${SSH_USER}"
                        echo "Using SSH private key from: ${SSH_KEY_PATH}"

                        // Save Docker images to tar files
                        echo 'Saving Docker images as tar files...'
                        sh """
                            docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar
                            docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar
                        """

                        // Transfer tar files to the VM
                        echo 'Copying Docker images to VM...'
                        sh """
                            scp -i ${SSH_KEY_PATH} backend.tar frontend.tar ${SSH_USER}@${IP}:/tmp
                        """

                        // Deploy on the VM
                        echo 'SSH into the VM to load and start containers...'
                        sh """
                            ssh -i ${SSH_KEY_PATH} ${SSH_USER}@${IP} <<EOF
                                set -e
                                echo 'Starting deployment on VM...'

                                # Navigate to Docker Compose directory
                                echo 'Navigating to MongoDB Docker Compose directory: ${MONGO_DOCKER_COMPOSE_DIR}'
                                cd ${MONGO_DOCKER_COMPOSE_DIR}

                                # Load Docker images
                                echo 'Loading Docker images on VM...'
                                docker load -i /tmp/backend.tar
                                docker load -i /tmp/frontend.tar

                                # Start MongoDB and App using Docker Compose
                                echo 'Starting Docker Compose services...'
                                docker-compose up -d
EOF
                        """
                    }
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
