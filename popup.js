window.onload = ()=>{
    const sgntRed = 'rgb(255,153,153)'
    const sgntGreen = 'rgb(153,255,153)'
    const sgntBlue = 'rgb(51,51,255)'
    const sgntDarkRed = 'rgb(204,0,0)'

    // Logo copyright toggle
    document.getElementById('copyright-logo').onclick = ()=>{
        document.getElementById('img-copyright').style.display = 'block'
    }
    document.getElementById('img-copyright').onmouseleave = ()=>{
        document.getElementById('img-copyright').style.display = 'none'
    }

    const modifySiData = (id,column,data)=>{
        chrome.storage.local.get(['siData'],(obj)=>{
            const origin = obj.siData
            const modified = {
                idSequence : origin.idSequence,
                items : origin.items.map((item)=>{
                    console.log(item)
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

        document.getElementById('disabled'+id).style.display = 'inline'
        document.getElementById('enabled'+id).style.display = 'none'
    }

    // Return div mainRow
    const mainRow = (id,title,script,enable)=>{
        let result = document.createElement('div')

        let i = document.getElementsByClassName('titleP').length

            let titleP = document.createElement('p')
            titleP.className = 'titleP'
                let number = document.createElement('span')
                number.innerText = id + '. '
                titleP.appendChild(number)

                let titleElmt = document.createElement('span')
                titleElmt.innerText = title
                titleP.appendChild(titleElmt)

                let show = document.createElement('button')
                show.id = 'show'+id
                show.innerText = 'Show'
                titleP.appendChild(show)
                show.onclick = (e)=>{
                    let id = e.target.id.replace('show','')
                    document.getElementById('contentP'+id).style.display = 'block'
                    document.getElementById('close'+id).style.display = 'inline'
                    document.getElementById('show'+id).style.display = 'none'
                }

                let close = document.createElement('button')
                close.id = 'close'+id
                close.style.display = 'none'
                close.innerText = 'Close'
                titleP.appendChild(close)
                close.onclick = (e)=>{
                    let id = e.target.id.replace('close','')
                    document.getElementById('contentP'+id).style.display = 'none'
                    document.getElementById('show'+id).style.display = 'inline'
                    document.getElementById('close'+id).style.display = 'none'
                }

                let enabled = document.createElement('button')
                enabled.id = 'enabled'+id
                enabled.style.display = enable ? 'inline' : 'none'
                enabled.style.backgroundColor = sgntGreen
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
                disabled.style.backgroundColor = sgntRed
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
                remove.style.backgroundColor = sgntDarkRed
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
                cancel.style.backgroundColor = sgntBlue
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
                confirm.style.backgroundColor = sgntDarkRed
                confirm.style.color = 'white'
                confirm.innerText = 'Confirm'
                titleP.appendChild(confirm)
            result.appendChild(titleP)

            let contentP = document.createElement('p')
            contentP.id = 'contentP'+id
            contentP.style.display = 'none'
            contentP.style.marginLeft = '10px'
            contentP.innerText = script
            result.appendChild(contentP)

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