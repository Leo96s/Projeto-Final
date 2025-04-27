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

USER jenkins

# Instalar plugins do Jenkins necessários
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow"
