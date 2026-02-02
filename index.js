const inquirer = require("inquirer");
const chalk = require("chalk");

const fs = require("fs");
operation();
function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answers) => {
      const action = answers["action"];
      if (action === "Criar conta") {
        createAccount();
      }
    })

    .catch((err) => console.log(err));
}

//create an account

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco! "));
  console.log(chalk.green("Defina as opções da sua conta a seguir: "));
}

function buildAccount() {
  inquirer.prompt([
    {
      name: "accountName",
      message: "Digite um nome para sua conta: ",
    },
  ]);
}
