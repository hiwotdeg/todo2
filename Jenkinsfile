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
