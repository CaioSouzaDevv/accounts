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
      console.log(action);
    })

    .catch((err) => console.log(err));
}
