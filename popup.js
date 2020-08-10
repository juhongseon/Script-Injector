'use strict'

window.onload = ()=>{
    const SGNT_RED = 'rgb(255,153,153)'
    const SGNT_GREEN = 'rgb(153,255,153)'
    const SGNT_BLUE = 'rgb(51,51,255)'
    const SGNT_DARK_RED = 'rgb(204,0,0)'
    const SGNT_GRAY = 'rgb(204,204,204)'

    // Logo copyright toggle
    document.getElementById('copyright-logo').onclick = ()=>{
        document.getElementById('img-copyright').style.display = 'block'
    }
    document.getElementById('img-copyright').onmouseleave = ()=>{
        document.getElementById('img-copyright').style.display = 'none'
    }

    // Remove from siData.items by id
    const removeData = (id)=>{
        chrome.storage.local.get(['siData'],(obj)=>{
            const origin = obj.siData
            const modified = {
                idSequence : origin.idSequence,
                items : origin.items.filter(item=>item.id!=id)
            }

            chrome.storage.local.set({siData:modified})
        })
    }

    // Modify local chrome storage data
    const modifySiData = (id,column,data)=>{
        chrome.storage.local.get(['siData'],(obj)=>{
            const origin = obj.siData
            const modified = {
                idSequence : origin.idSequence,
                items : origin.items.map((item)=>{
                    if(item.id==id) return {
                        id : item.id, title : item.title,
                        script : item.script, enable : item.enable,
                        [column] : data
                    }
                    else return item
                })
            }

            chrome.storage.local.set({siData:modified})
        })
    }

    // Return div mainRow
    const mainRow = (id,title,script,enable)=>{
        let result = document.createElement('div')
        result.id = 'div'+id
            let titleP = document.createElement('p')
            titleP.className = 'titleP'
                let number = document.createElement('span')
                number.innerText = id + '. '
                titleP.appendChild(number)

                let titleElmt = document.createElement('span')
                titleElmt.id = 'titleElmt'+id
                titleElmt.innerText = title
                titleP.appendChild(titleElmt)

                let titleEdit = document.createElement('input')
                titleEdit.id = 'titleEdit'+id
                titleEdit.size = '15'
                titleEdit.maxLength = '15'
                titleEdit.value = title
                titleEdit.style.display = 'none'
                titleP.appendChild(titleEdit)

                let show = document.createElement('button')
                show.id = 'show'+id
                show.style.backgroundColor = SGNT_GRAY
                show.innerText = 'Show'
                titleP.appendChild(show)
                show.onclick = (e)=>{
                    let id = e.target.id.replace('show','')
                    document.getElementById('editP'+id).style.display = 'block'
                    document.getElementById('scriptP'+id).style.display = 'block'
                    document.getElementById('close'+id).style.display = 'inline'
                    document.getElementById('show'+id).style.display = 'none'
                }

                let close = document.createElement('button')
                close.id = 'close'+id
                close.style.display = 'none'
                close.style.backgroundColor = SGNT_GRAY
                close.innerText = 'Close'
                titleP.appendChild(close)
                close.onclick = (e)=>{
                    let id = e.target.id.replace('close','')
                    document.getElementById('editP'+id).style.display = 'none'
                    document.getElementById('scriptP'+id).style.display = 'none'
                    document.getElementById('show'+id).style.display = 'inline'
                    document.getElementById('close'+id).style.display = 'none'
                }

                let enabled = document.createElement('button')
                enabled.id = 'enabled'+id
                enabled.style.display = enable ? 'inline' : 'none'
                enabled.style.backgroundColor = SGNT_GREEN
                enabled.innerText = 'Enabled'
                titleP.appendChild(enabled)
                enabled.onclick = (e)=>{
                    let id = e.target.id.replace('enabled','')

                    modifySiData(id,'enable',false)

                    document.getElementById('disabled'+id).style.display = 'inline'
                    document.getElementById('enabled'+id).style.display = 'none'
                }

                let disabled = document.createElement('button')
                disabled.id = 'disabled'+id
                disabled.style.display = enable ? 'none' : 'inline'
                disabled.style.backgroundColor = SGNT_RED
                disabled.innerText = 'Disabled'
                titleP.appendChild(disabled)
                disabled.onclick = (e)=>{
                    let id = e.target.id.replace('disabled','')

                    modifySiData(id,'enable',true)

                    document.getElementById('enabled'+id).style.display = 'inline'
                    document.getElementById('disabled'+id).style.display = 'none'
                }

                let remove = document.createElement('button')
                remove.id = 'remove'+id
                remove.style.backgroundColor = SGNT_DARK_RED
                remove.style.color = 'white'
                remove.innerText = 'Remove'
                titleP.appendChild(remove)
                remove.onclick = (e)=>{
                    let id = e.target.id.replace('remove','')
                    document.getElementById('remove'+id).style.display = 'none'
                    document.getElementById('cancel'+id).style.display = 'inline'
                    document.getElementById('confirm'+id).style.display = 'inline'
                }

                let cancel = document.createElement('button')
                cancel.id = 'cancel'+id
                cancel.style.display = 'none'
                cancel.style.backgroundColor = SGNT_BLUE
                cancel.style.color = 'white'
                cancel.innerText = 'Cancel'
                titleP.appendChild(cancel)
                cancel.onclick = (e)=>{
                    let id = e.target.id.replace('cancel','')
                    document.getElementById('cancel'+id).style.display = 'none'
                    document.getElementById('confirm'+id).style.display = 'none'
                    document.getElementById('remove'+id).style.display = 'inline'
                }

                let confirm = document.createElement('button')
                confirm.id = 'confirm'+id
                confirm.style.display = 'none'
                confirm.style.backgroundColor = SGNT_DARK_RED
                confirm.style.color = 'white'
                confirm.innerText = 'Confirm'
                titleP.appendChild(confirm)
                confirm.onclick = (e)=>{
                    let id = e.target.id.replace('confirm','')
                    removeData(id)
                    document.getElementById('div'+id).remove()
                }
            result.appendChild(titleP)

            let editP = document.createElement('p')
            editP.id = 'editP'+id
            editP.style.display = 'none'
            editP.style.marginLeft = '8px'
            editP.style.marginBottom = '2px'
                let edit = document.createElement('button')
                edit.id = 'edit'+id
                edit.style.backgroundColor = SGNT_GRAY
                edit.innerText = 'Edit'
                editP.appendChild(edit)
                edit.onclick = (e)=>{
                    let id = e.target.id.replace('edit','')
                    document.getElementById('edit'+id).style.display = 'none'
                    document.getElementById('editSave'+id).style.display = 'inline'
                    document.getElementById('editCancel'+id).style.display = 'inline'
                    document.getElementById('titleElmt'+id).style.display = 'none'
                    document.getElementById('titleEdit'+id).style.display = 'inline'
                    document.getElementById('scriptP'+id).style.display = 'none'
                    document.getElementById('scriptEdit'+id).style.display = 'inline'
                }

                let editSave = document.createElement('button')
                editSave.id = 'editSave'+id
                editSave.style.backgroundColor = SGNT_BLUE
                editSave.style.color = 'white'
                editSave.style.display = 'none'
                editSave.innerText = 'Save'
                editP.appendChild(editSave)
                editSave.onclick = (e)=>{
                    let id = e.target.id.replace('editSave','')

                    let modifiedTitle = document.getElementById('titleEdit'+id).value
                    document.getElementById('titleElmt'+id).innerText = modifiedTitle
                    modifySiData(id,'title',modifiedTitle)
                    
                    let modifiedScript = document.getElementById('scriptEdit'+id).value
                    document.getElementById('scriptP'+id).innerText = modifiedScript
                    setTimeout(()=>{modifySiData(id,'script',modifiedScript)},100)

                    document.getElementById('editSave'+id).style.display = 'none'
                    document.getElementById('editCancel'+id).style.display = 'none'
                    document.getElementById('edit'+id).style.display = 'inline'
                    document.getElementById('titleEdit'+id).style.display = 'none'
                    document.getElementById('scriptEdit'+id).style.display = 'none'
                    document.getElementById('titleElmt'+id).style.display = 'inline'
                    document.getElementById('scriptP'+id).style.display = 'block'
                }

                let editCancel = document.createElement('button')
                editCancel.id = 'editCancel'+id
                editCancel.style.backgroundColor = SGNT_DARK_RED
                editCancel.style.color = 'white'
                editCancel.style.display = 'none'
                editCancel.innerText = 'Cancel'
                editP.appendChild(editCancel)
                editCancel.onclick = (e)=>{
                    let id = e.target.id.replace('editCancel','')

                    document.getElementById('titleEdit'+id).value = document.getElementById('titleElmt'+id).innerText
                    document.getElementById('scriptEdit'+id).value = document.getElementById('scriptP'+id).innerText

                    document.getElementById('editSave'+id).style.display = 'none'
                    document.getElementById('editCancel'+id).style.display = 'none'
                    document.getElementById('edit'+id).style.display = 'inline'
                    document.getElementById('titleEdit'+id).style.display = 'none'
                    document.getElementById('scriptEdit'+id).style.display = 'none'
                    document.getElementById('titleElmt'+id).style.display = 'inline'
                    document.getElementById('scriptP'+id).style.display = 'block'
                }
            result.appendChild(editP)

            let scriptP = document.createElement('p')
            scriptP.id = 'scriptP'+id
            scriptP.style.display = 'none'
            scriptP.style.marginLeft = '10px'
            scriptP.style.border = '1px solid '+SGNT_GRAY
            scriptP.style.borderRadius = '4px'
            scriptP.style.padding = '4px'
            scriptP.innerText = script
            result.appendChild(scriptP)

            let scriptEdit = document.createElement('textarea')
            scriptEdit.id = 'scriptEdit'+id
            scriptEdit.style.display = 'none'
            scriptEdit.style.marginLeft = '10px'
            scriptEdit.style.border = '1px solid '+SGNT_GRAY
            scriptEdit.style.borderRadius = '4px'
            scriptEdit.style.minWidth = '265px'
            scriptEdit.style.maxWidth = '265px'
            scriptEdit.style.minHeight = '50px'
            scriptEdit.style.maxHeight = '400px'
            scriptEdit.innerText = script
            result.appendChild(scriptEdit)

        return result
    }

    // AddBtn click event handler
    // Concat new array item into chrome.storage.local.siData.items and idSequence++
    // Append new mainRow into document.body
    const addClickHandler = ()=>{
        chrome.storage.local.get(['siData'],(localStorageData)=>{
            let siData = localStorageData.siData
            let id = siData.idSequence

            document.body.appendChild(mainRow(id+1,'sample title','sample script'))

            chrome.storage.local.set({
                siData : {
                    idSequence : id+1,
                    items : [
                        ...siData.items,
                        {
                            id : id+1,
                            title : 'sample title',
                            script : 'sample script',
                            enable : false
                        }
                    ]
                }
            })
        })
    }
    document.getElementById('add').style.backgroundColor = SGNT_GRAY

    // Main Task
    chrome.storage.local.get(['siData'],(localStorageData)=>{
        let siData = localStorageData.siData

        document.getElementById('add').onclick = addClickHandler
    
        let items = siData.items
        for(let i=0; i<items.length; i++) {
            document.body.appendChild(mainRow(items[i].id,items[i].title,items[i].script,items[i].enable))
        }
    })
}