pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 16' 
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                dir('server') {
                    sh 'npm install'
                }
                dir('client') {
                    sh 'npm install'
                    sh 'echo "Client dependencies installed"'
                    sh 'ls node_modules' 
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                dir('client') {
                    sh 'ls node_modules'
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo 'Running backend tests...'
                dir('server') {
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
