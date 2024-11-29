pipeline {
    agent any

    tools {
        nodejs "NodeJS 16" // Ensure NodeJS is installed on the Jenkins agent
    }

    environment {
        // Define any environment variables you may need
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Verify Workspace') {
            steps {
                echo 'Verifying workspace structure...'
                sh 'ls -la'
                sh 'ls -la TODO'
                sh 'ls -la TODO/todo_frontend'
                sh 'ls -la TODO/todo_backend'
            }
        }

        stage('Build and Deploy with Docker Compose') {
            steps {
                echo 'Building and deploying the application using Docker Compose...'

                // Build the application
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache"

                // Start the application
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
            }
        }

        

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
