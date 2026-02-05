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
				choices: ["Criar conta", "Consultar saldo", "Depositar", "Sacar", "Sair"],
			},
		])
		.then((answers) => {
			const action = answers.action;

			if (action === "Criar conta") return createAccount();
			if (action === "Consultar saldo") return getAccountBalance();
			if (action === "Depositar") return deposit();
			if (action === "Sacar") return withdraw();
			if (action === "Sair") {
				console.log(chalk.bgBlue.black("Obrigado por usar nosso banco! "));
				process.exit();
			}
		})
		.catch((err) => console.log(err));
}

function createAccount() {
	console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco! "));
	console.log(chalk.green("Defina as opções da sua conta a seguir: "));
	buildAccount();
}

function buildAccount() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Digite um nome para sua conta: ",
			},
		])
		.then((answer) => {
			const accountName = answer.accountName?.trim();

			if (!accountName) {
				console.log(chalk.red("Nome inválido. Tente novamente."));
				return buildAccount();
			}

			if (!fs.existsSync("accounts")) {
				fs.mkdirSync("accounts");
			}

			if (fs.existsSync(`accounts/${accountName}.json`)) {
				console.log(chalk.red("Conta já existente, escolha outro nome."));
				return buildAccount();
			}

			fs.writeFileSync(`accounts/${accountName}.json`, '{"balance":0}', "utf-8");

			console.log(chalk.green("Parabéns, sua conta foi criada!"));
			operation();
		})
		.catch((err) => console.log(err));
}

function deposit() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Qual o nome da sua conta?",
			},
		])
		.then((answer) => {
			const accountName = answer.accountName?.trim();

			if (!checkAccount(accountName)) return deposit();

			inquirer
				.prompt([
					{
						name: "amount",
						message: "Quanto você deseja depositar?",
					},
				])
				.then((answer) => {
					const amount = parseFloat(String(answer.amount).replace(",", "."));
					if (!isValidAmount(amount)) return deposit();

					addAmount(accountName, amount);
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

function withdraw() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Qual o nome da sua conta?",
			},
		])
		.then((answer) => {
			const accountName = answer.accountName?.trim();

			if (!checkAccount(accountName)) return withdraw();

			inquirer
				.prompt([
					{
						name: "amount",
						message: "Quanto você deseja sacar?",
					},
				])
				.then((answer) => {
					const amount = parseFloat(String(answer.amount).replace(",", "."));
					if (!isValidAmount(amount)) return withdraw();

					removeAmount(accountName, amount);
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
}

function getAccountBalance() {
	inquirer
		.prompt([
			{
				name: "accountName",
				message: "Qual o nome da sua conta?",
			},
		])
		.then((answer) => {
			const accountName = answer.accountName?.trim();

			if (!checkAccount(accountName)) return getAccountBalance();

			const accountData = getAccount(accountName);
			console.log(chalk.bgBlue.black(`O saldo da conta "${accountName}" é R$ ${accountData.balance.toFixed(2)}`));
			operation();
		})
		.catch((err) => console.log(err));
}

function checkAccount(accountName) {
	if (!accountName) {
		console.log(chalk.red("Nome inválido."));
		return false;
	}

	if (!fs.existsSync(`accounts/${accountName}.json`)) {
		console.log(chalk.red("Conta não existente, escolha outro nome!"));
		return false;
	}

	return true;
}

function isValidAmount(amount) {
	if (!Number.isFinite(amount) || amount <= 0) {
		console.log(chalk.red("Valor inválido. Digite um número maior que zero."));
		return false;
	}
	return true;
}

function addAmount(accountName, amount) {
	const accountData = getAccount(accountName);
	accountData.balance = Number(accountData.balance) + amount;

	fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData, null, 2), "utf-8");

	console.log(chalk.green(`Foi depositado R$ ${amount.toFixed(2)} na sua conta!`));
	operation();
}

function removeAmount(accountName, amount) {
	const accountData = getAccount(accountName);
	const balance = Number(accountData.balance);

	if (amount > balance) {
		console.log(chalk.red("Saldo insuficiente!"));
		return operation();
	}

	accountData.balance = balance - amount;

	fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData, null, 2), "utf-8");

	console.log(chalk.green(`Saque de R$ ${amount.toFixed(2)} realizado com sucesso!`));
	operation();
}

function getAccount(accountName) {
	const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
		encoding: "utf-8",
	});
	return JSON.parse(accountJSON);
}
