pipeline {
    agent any

    environment {
        BACKEND_DOCKER_IMAGE = 'mern-todo-app-backend'
        FRONTEND_DOCKER_IMAGE = 'mern-todo-app-frontend'
        HARBOR_REGISTRY = 'registry.kifiya.et'
        HARBOR_CREDENTIALS_USR = credentials('harbor-credentials-username')  
        HARBOR_CREDENTIALS_PSW = credentials('harbor-credentials-password')  
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

        stage('Push Docker Images to Harbor') {
            steps {
                script {
                    echo 'Logging in to Harbor...'
                    sh """
                        echo '${HARBOR_CREDENTIALS_PSW}' | docker login ${HARBOR_REGISTRY} -u ${HARBOR_CREDENTIALS_USR} --password-stdin
                    """

                    echo 'Tagging and pushing backend image to Harbor...'
                    sh """
                        docker tag ${BACKEND_DOCKER_IMAGE} ${HARBOR_REGISTRY}/kft-lab/${BACKEND_DOCKER_IMAGE}:latest
                        docker push ${HARBOR_REGISTRY}/kft-lab/${BACKEND_DOCKER_IMAGE}:latest
                    """
                    
                    echo 'Tagging and pushing frontend image to Harbor...'
                    sh """
                        docker tag ${FRONTEND_DOCKER_IMAGE} ${HARBOR_REGISTRY}/kft-lab/${FRONTEND_DOCKER_IMAGE}:latest
                        docker push ${HARBOR_REGISTRY}/kft-lab/${FRONTEND_DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Docker Pull - Backend and Frontend') {
            steps {
                script {
                    echo 'Pulling backend and frontend images from Harbor...'
                    sh """
                        docker pull ${HARBOR_REGISTRY}/kft-lab/${BACKEND_DOCKER_IMAGE}:latest
                        docker pull ${HARBOR_REGISTRY}/kft-lab/${FRONTEND_DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying backend container...'
                    sh """
                        docker run -d --name backend-container --network todo-app-network \
                        -e MONGO_URI='mongodb://mongodb:27017/todo-app' \
                        -p 5000:5000 ${HARBOR_REGISTRY}/kft-lab/${BACKEND_DOCKER_IMAGE}:latest
                    """

                    echo 'Deploying frontend container...'
                    sh """
                        docker run -d --name frontend-container --network todo-app-network \
                        -p 3000:80 ${HARBOR_REGISTRY}/kft-lab/${FRONTEND_DOCKER_IMAGE}:latest
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
