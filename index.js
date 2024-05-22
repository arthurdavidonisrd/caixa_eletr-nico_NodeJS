const inquirer = require('inquirer')
const fs = require('fs')
const { default: Choices } = require('inquirer/lib/objects/choices')
const { parse } = require('path')

operation()



function operation(){
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
            "Criar conta", 
            "Consultar saldo",
            "Depositar", 
            "Sacar",
            "Sair"
        ]
    }])
    .then((answear) => {
        const action = answear['action'] 

        if(action === "Criar conta"){
            createAccount()
        }
        else if(action === "Depositar"){
            deposit()

        }
        else if(action === "Consultar saldo"){
            getAccountBalance()

        }
        else if(action === "Sacar"){
            withdraw()

        }
        else if(action === "Sair"){
            console.log("Você esta deslogado. Obrigado por usar o Accounts")
            process.exit()
        }
    })
    .catch(err => console.log(err))

}



function createAccount(){
    console.log("Obrigado por escolher o Accounts!")
    console.log("Defina as opções de sua conta a seguir")
    buildAccount()
}



function buildAccount(){
    inquirer.prompt([{
        name: "accountName",
        message: "Digite um nome para sua conta:"
    }])
    .then((answear) =>{

        const accountName = answear['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log("Esta conta ja existe! Escolha outro nome.")
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance" : 0}', function(err){
            console.log(err)
        })

        console.log("Parabéns! Sua conta acaba de ser criada.")
        operation()

    })
    .catch(err => console.log(err))
}

function deposit(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?:"
    }])
    .then((answear) =>{
        const accountName = answear['accountName']

        if(!checkAccountName(accountName)){
            return deposit()
        }

        inquirer.prompt([{
            name: "value",
            message: "Quanto deseja depositar?"
        }])
        .then((answear) =>{

            const amount = answear['value']
            addAmount(accountName, amount)
            operation()

        })
        .catch((err) => console.log(err))




    })
    .catch(err => console.log(err))
}


function checkAccountName(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log("Esta conta não existe. Tente novamente")
        return false
    }

    return true
}



function addAmount(accountName, amount){
    const account = getAccount(accountName)

    if(!amount){
        console.log("Ocorreu um erro")
        return deposit()
    }

    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), function(err){
        console.log(err)
    })


    console.log(`Foi depositado um valor de R$${amount} na sua conta.`)
    

}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: "utf-8", 
        flag: "r"
    })

    return JSON.parse(accountJSON)
}


function getAccountBalance(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?:"
    }])
    .then((answear) =>{

        
         const accountName = answear['accountName']

         if(!checkAccountName(accountName)){
            return getAccountBalance()
         }

         const accountData = getAccount(accountName)

         console.log(`O saldo da sua conta atualmente é: R$${accountData.balance}`)


        operation()
    })
    .catch((err) => console.log(err))

}


function withdraw(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?",
    }])
    .then((answear) =>{
        const accountName = answear['accountName']

        if(!checkAccountName(accountName)){
            return withdraw()
        }

        inquirer.prompt([{
            name: "amount",
            message: "Quanto você deseja sacar?"
        }])
        .then((answear) =>{
            const amount = answear['amount']
            removeAmount(accountName, amount)

        })
        .catch((err) => console.log(err))

    })
    .catch((err) => console.log(err))

}

function removeAmount(accountName, amount){
    const account = getAccount(accountName)

    if(!amount){
        console.log("Algo deu errado. Tente novamente")
        return withdraw()
    }


    if(account.balance < amount){
        console.log("Valor indisponível")
        return withdraw()
    }


    account.balance = parseFloat(account.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), function(err){
        console.log(err)
    })


    console.log(`Foi realizado um saque de R$${amount} da sua conta`)
    console.log(`Seu saldo pós saque é de R$${account.balance}`)
}