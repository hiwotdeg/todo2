pipeline {
    agent any
     
    tools {
        nodejs "NodeJS 16"
    }

    environment {
        FRONTEND_IMAGE = 'todo-frontend'
        BACKEND_IMAGE = 'todo-backend'
        VM_IP = '10.254.99.54'  // Replace with your VM's IP address
        VM_USER = 'kifiya' // Replace with your VM's user
        MONGO_URL = 'mongodb://admin:password@mongo:27017/TODO' // MongoDB URL
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm // This will pull code from the configured repository
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('TODO/todo_frontend') {
                    script {
                        // Build the frontend image
                        sh "docker build -t ${FRONTEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('TODO/todo_backend') {
                    script {
                        // Build the backend image
                        sh "docker build -t ${BACKEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    // Copy the frontend code to the VM
                    sh """
                    scp -r TODO/todo_frontend ${VM_USER}@${VM_IP}:~/todo_frontend
                    ssh ${VM_USER}@${VM_IP} 'docker run -d --name frontend -p 80:80 ${FRONTEND_IMAGE}'
                    """
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                script {
                    // Copy the backend code to the VM
                    sh """
                    scp -r TODO/todo_backend ${VM_USER}@${VM_IP}:~/todo_backend
                    ssh ${VM_USER}@${VM_IP} 'docker run -d --name backend -p 5000:5000 -e MONGO_URL=${MONGO_URL} ${BACKEND_IMAGE}'
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Frontend and Backend deployed successfully!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
