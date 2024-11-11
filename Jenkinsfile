pipeline {
    agent any
    
    tools {
        nodejs "NodeJS_16" // Replace "NodeJS_16" with the name of the Node.js installation in Jenkins
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
                
                dir('server') {
                    sh 'npm install'
                }
                
                dir('client') {
                    sh 'npm install --verbose'
                    sh 'if [ ! -d "node_modules" ]; then echo "node_modules directory missing after npm install"; exit 1; fi'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                dir('client') {
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
