let accounts={}
function importData(){
	let fileInput=document.createElement(`input`)
	fileInput.type=`file`
	fileInput.accept=`.json`
	fileInput.style.display=`none`
	fileInput.onchange=(e)=>{
		let reader=new FileReader()
		reader.onload=()=>{
			console.log(`Imported database: `,accounts=JSON.parse(reader.result))
			renderAccount(0)
		}
		reader.readAsText(e.target.files[0])
		document.body.removeChild(fileInput)
	}
	fileInput.oncancel=()=>{
		document.body.removeChild(fileInput)
	}
	document.body.appendChild(fileInput)
	fileInput.click()
}
function exportData(){
	let date=new Date().toISOString().split('T')[0]
	let file=new Blob([JSON.stringify(accounts)],{type:`application/json`})
	let link=document.createElement(`a`)
	link.href=URL.createObjectURL(file)
	link.download=`Future Fund data-${date}.json`
	link.click()
	URL.revokeObjectURL(link.href)
}
function createAccount(){
	let accountName=prompt(`Choose a name for the new account.`)
	if(accountName){
		accounts[accountName]={balances:{}}
		renderAccount(accountName)
	}
}
function reportBalance(){
	let balance=prompt(`Enter your current balance for account:\n${selectedAccountName}`)
	let timestampUTCISO=new Date().toISOString()
	if(balance){
		accounts[selectedAccountName].balances[timestampUTCISO]=balance
		renderAccount()
	}
}
let selectedAccountId=0
let selectedAccountName=``
function renderAccount(account){
	document.getElementById(`export`).classList.remove(`action-blocked`)
	document.getElementById(`report-balance`).classList.remove(`action-blocked`)
	if(typeof account ===`string`){
		selectedAccountName=account
		selectedAccountId=Object.keys(accounts).indexOf(account)
	}else if(typeof account ===`number`){
		//	'account' parameter doubles as an instruction on changing the selected account either forwards or backwards
		if(selectedAccountId===0&&account===-1){
			selectedAccountId=Object.keys(accounts).length-1
		}else if(selectedAccountId===Object.keys(accounts).length-1&&account===1){
			selectedAccountId=0
		}else{
			selectedAccountId+=account
		}
		selectedAccountName=Object.keys(accounts)[selectedAccountId]
	}
	document.getElementById(`selected-account-name`).innerHTML=selectedAccountName
	document.getElementById(`accounts-dots`).innerHTML=``
	let accountsCount=0
	for(let account of Object.keys(accounts)){
		++accountsCount
		document.getElementById(`accounts-dots`).innerHTML+=`<span>${account===selectedAccountName?`&#9864;`:`&#9862;`}</span>`
	}
	for(let arrow of document.getElementsByClassName(`selected-account-arrow`)){
		if(accountsCount>1){
			arrow.classList.remove(`static-account`)
		}else{
			arrow.classList.add(`static-account`)
		}
	}
	let balances=Object.entries(accounts[selectedAccountName].balances)
	if(balances.length){
		document.getElementById(`selected-account-balance`).innerHTML=parseFloat(balances[balances.length-1][1]).toFixed(2)
	}else{
		document.getElementById(`selected-account-balance`).innerHTML=``
	}
}