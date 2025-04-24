pipeline {
    agent any

    environment {
        // Variáveis de ambiente, por exemplo, chave de autenticação do Vercel
        VERCEL_TOKEN = credentials('vercel-token') // Supondo que você tenha configurado a chave de autenticação no Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                // Baixar o código do repositório
                git 'https://github.com/Leo96s/Projeto-Final'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Instalar dependências do Node.js
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                // Executar testes, caso você tenha algum teste configurado
                script {
                    sh 'npm test'
                }
            }
        }

        stage('Deploy to Vercel') {
            steps {
                script {
                    // Exemplo de deploy no Vercel usando a CLI do Vercel
                    sh 'vercel --prod --token $VERCEL_TOKEN'
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy realizado com sucesso!'
        }
        failure {
            echo 'Falha no deploy!'
        }
    }
}
