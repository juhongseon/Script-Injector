'use strict'

window.onload = ()=>{
    const scriptInject = (id,script)=>{
        let scriptElmt = document.createElement('script')
        scriptElmt.id = 'script'+id
        scriptElmt.innerText = script
        document.body.appendChild(scriptElmt)
    }

    chrome.storage.local.get(['siData'],(obj)=>{
        let items = obj.siData.items
        items.map((item)=>{
            if(item.enable===true) {
                scriptInject(item.id,item.script)
            }
        })
    })

    chrome.storage.onChanged.addListener((changes,namespace)=>{
        for(let key in changes) {
            let storageChange = changes[key]
            if(key==='siData' && namespace==='local' && storageChange.oldValue.items.length === storageChange.newValue.items.length) {
                let oldItems = storageChange.oldValue.items
                let newItems = storageChange.newValue.items

                newItems.map((item,idx)=>{
                    if(item.enable===true) {
                        if(item.title!==oldItems[idx].title) return
                        if(oldItems[idx].enable===true) {
                            document.getElementById('script'+item.id).remove()
                        }
                        scriptInject(item.id,item.script)
                    } else {
                        if(oldItems[idx].enable===true)
                            document.getElementById('script'+item.id).remove()
                    }
                })
            }
        }
    })
}