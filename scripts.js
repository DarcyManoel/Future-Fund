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
	let accountName=prompt(`Choose a name for the new account`)
	if(accountName){
		accounts[accountName]={}
		renderAccount(0,accountName)
	}
}
let selectedAccountId=0
function renderAccount(relativeMovement,accountName){
	document.getElementById(`data-tools`).style.display=``
	if(accountName){
		selectedAccountId=Object.keys(accounts).indexOf(accountName)
	}else{
		if(selectedAccountId===0&&relativeMovement===-1){
			selectedAccountId=Object.keys(accounts).length-1
		}else if(selectedAccountId===Object.keys(accounts).length-1&&relativeMovement===1){
			selectedAccountId=0
		}else{
			selectedAccountId+=relativeMovement
		}
		accountName=Object.keys(accounts)[selectedAccountId]
	}
	let staticAccountClass=Object.keys(accounts).length===1?`static-account`:``
	document.getElementById(`A-account`).innerHTML=`<div onclick="renderAccount(-1)" class="AA-arrow ${staticAccountClass}"${staticAccountClass}></div>${accountName}<div onclick="renderAccount(1)" class="AA-arrow ${staticAccountClass}"></div>`
	document.getElementById(`A-account`).style.opacity=``
	document.getElementById(`A-account`).classList.add(`selected-account`)
	document.getElementById(`A-accounts-dots`).innerHTML=``
	for(let account of Object.keys(accounts)){
		document.getElementById(`A-accounts-dots`).innerHTML+=`<span>${account===accountName?`&#9864;`:`&#9862;`}</span>`
	}
	document.getElementById(`A-accounts-dots`).innerHTML+=`|<span id="AAD-create" onclick="createAccount()">create account</span>`
}