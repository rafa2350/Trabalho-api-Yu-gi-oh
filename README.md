# Yu-Gi-Oh! Card Collection

Projeto desenvolvido em **React Native** utilizando **Expo**, com o objetivo de criar um aplicativo para visualizar cartas de Yu-Gi-Oh! através de uma API.

## Sobre o projeto

O **Yu-Gi-Oh! Card Collection** é um aplicativo mobile que busca informações de cartas de Yu-Gi-Oh! através da **Yu-Gi-Oh! API** e mostra essas informações na tela.

O usuário pode visualizar as cartas e algumas de suas principais informações, como:

* Nome da carta
* Imagem
* Tipo
* Atributo
* Nível
* ATK
* DEF
* Descrição da carta

O projeto foi desenvolvido como um trabalho acadêmico para praticar conceitos de desenvolvimento de aplicativos utilizando React Native.

## Objetivo

O principal objetivo do projeto foi aprender e praticar:

* React Native
* Expo
* JavaScript
* Consumo de API
* Requisições HTTP
* Organização de componentes
* Git e GitHub

## Tecnologias utilizadas

* **React Native** — desenvolvimento do aplicativo
* **Expo** — execução e testes do aplicativo
* **JavaScript** — linguagem utilizada
* **Node.js** — ambiente necessário para o projeto
* **npm** — instalação das dependências
* **Git** — controle de versão
* **GitHub** — armazenamento do projeto

## API utilizada

Para obter as informações das cartas, foi utilizada a **Yu-Gi-Oh! API**.

API:

```text
https://db.ygoprodeck.com/api/v7/cardinfo.php
```

A API retorna as informações das cartas em formato **JSON**, que são utilizadas pelo aplicativo para mostrar os dados na tela.

## Como instalar o projeto

Primeiro, é necessário ter o **Node.js** instalado no computador.

Depois, abra a pasta do projeto no VS Code e abra o terminal.

Instale as dependências:

```bash
npm install
```

Depois, inicie o projeto:

```bash
npx expo start -c
```

O Expo irá iniciar o projeto e mostrar as opções para executar o aplicativo.

## Como executar

Depois de iniciar o Expo, o aplicativo pode ser testado utilizando um dispositivo compatível ou um emulador.

Também é possível utilizar o **Expo Go** em um celular, dependendo da configuração do projeto.

## Como o aplicativo funciona

O funcionamento básico do projeto é:

```text
Aplicativo
    ↓
Faz uma requisição para a API
    ↓
API retorna os dados das cartas
    ↓
Aplicativo recebe os dados
    ↓
As cartas são mostradas na tela
```

Os dados são recebidos em JSON e utilizados pelo React Native para criar a lista de cartas.

## Estrutura básica

A estrutura do projeto pode conter arquivos e pastas como:

```text
Yu-Gi-Oh-Card-Collection/
│
├── assets/
├── components/
├── App.js
├── package.json
├── package-lock.json
└── README.md
```

A estrutura pode mudar dependendo das alterações feitas durante o desenvolvimento.

## Consumo da API

A API é acessada através de uma requisição HTTP.

Um exemplo simples seria:

```javascript
fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
```

Depois que os dados são recebidos, eles podem ser convertidos para JSON e utilizados no aplicativo.

## O que aprendemos com o projeto

Durante o desenvolvimento, conseguimos praticar alguns conceitos importantes, como:

* Criar um aplicativo com React Native;
* Utilizar o Expo;
* Trabalhar com componentes;
* Fazer requisições para uma API;
* Trabalhar com dados JSON;
* Mostrar informações de forma dinâmica;
* Utilizar npm;
* Utilizar Git e GitHub.

## Possíveis melhorias

Algumas funcionalidades que poderiam ser adicionadas futuramente:

* Pesquisa de cartas pelo nome;
* Filtro por tipo de carta;
* Sistema de favoritos;
* Tela com mais detalhes da carta;
* Criar uma coleção própria;
* Melhorar o sistema de navegação;
* Adicionar mais filtros.

## Status do projeto

**Projeto acadêmico desenvolvido para aprendizado de React Native e consumo de APIs.**

## Desenvolvedores

**Rafael Rodrigues Reis**
**Isaias**

Projeto desenvolvido para fins acadêmicos.

