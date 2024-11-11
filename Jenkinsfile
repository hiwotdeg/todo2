pipeline {
    agent any
    
    tools {
        nodejs "NodeJS 16" 
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                
                dir('todo_frontend') {
                    sh 'cd ./todo_frontend'
                    sh 'npm install'
                }
                
                dir('todo_backend') {
                    sh 'ls -la' 
                    sh 'npm install --verbose'
                    sh 'ls -la' 
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                dir('todo_frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Running backend tests...'
                dir('todo_backend') {
                    sh 'npm test'
                }
            }
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
            echo 'Cleaning up...'
            cleanWs()
        }
    }
}
