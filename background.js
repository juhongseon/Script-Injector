'use strict'

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(['siData'],(obj)=>{
        try {
            obj.siData.idSequence
            console.log('Browser already has data for Script Injection')
        } catch (e) {
            chrome.storage.local.set({
                siData : {
                    idSequence : 1,
                    items : [
                        {
                            id : 1,
                            title : 'sample title',
                            script : 'console.log("sample script")',
                            enable : false
                        }
                    ]
                }
            },()=>{
                console.log('Set initial data for Script Injection')
            })
        }
    })

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({})],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }])
    })
})