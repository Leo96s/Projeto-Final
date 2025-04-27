FROM jenkins/jenkins:lts-jdk17

USER root

# Atualizar e instalar dependências
RUN apt-get update && apt-get install -y lsb-release curl gnupg2

# Instalar Docker CLI
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli

# Instalar Node.js (necessário para rodar a CLI do Vercel)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

    # Cria o diretório onde o Jenkins guarda os dados
RUN mkdir -p /var/jenkins_home

# Copia o config.xml (configuração do job da pipeline) para o local correto
COPY config.xml /var/jenkins_home/jobs/my-pipeline-job/config.xml

# Copia o jenkins.yaml (configuração global) para o local correto
COPY jenkins.yaml /var/jenkins_home/jenkins.yaml

# Define o diretório de trabalho do Jenkins
WORKDIR /var/jenkins_home

# Permite que o Jenkins seja executado com a permissão do usuário "jenkins"
USER jenkins

# Exponha a porta 8080 se você for acessar via interface web
EXPOSE 8080

# Instalar plugins do Jenkins necessários
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow"
