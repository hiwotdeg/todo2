pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        IP = credentials('IP') // Secret text for VM IP
        SSH_USER = credentials('SSH_USER') // Secret text for SSH user
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
                        echo "IP: ${IP}"
                        echo "SSH_USER: ${SSH_USER}"
                        echo "SSH_KEY_PATH: ${SSH_KEY_PATH}"

                        sh """
                            # Save Docker images as tar files
                            docker save ${BACKEND_DOCKER_IMAGE} -o backend.tar
                            docker save ${FRONTEND_DOCKER_IMAGE} -o frontend.tar

                            # Debug SCP (Verbose output)
                            scp -vvv -i ${SSH_KEY_PATH} backend.tar frontend.tar ${SSH_USER}@${IP}:/tmp

                            # Debug SSH Deployment (Verbose output)
                            ssh -vvv -i ${SSH_KEY_PATH} ${SSH_USER}@${IP} << EOF
                                set -e
                                echo 'Starting deployment on VM...'

                                # Navigate to Docker Compose directory
                                cd \${MONGO_DOCKER_COMPOSE_DIR}

                                # Load Docker images
                                docker load -i /tmp/backend.tar
                                docker load -i /tmp/frontend.tar

                                # Start MongoDB and App
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
