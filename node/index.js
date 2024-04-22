
const { WebSocket } = require('ws')

const ws = new WebSocket('ws://localhost:8080/websocket/MathlibLatest')

ws.on('open', () => {
    // init lean
    ws.send(JSON.stringify({ jsonrpc: '2.0', id: 0, method: 'initialize', params: {} }))
    ws.send(JSON.stringify({ jsonrpc: '2.0', method: 'initialized', params:{} }))
    
    // send code
    const params = { textDocument: { uri: '1', languageId: 'lean4', version: 1, text:'#eval 3+1\n #eval IO.println "hello"' }}
    ws.send(JSON.stringify({ jsonrpc: '2.0', method: 'textDocument/didOpen', params }))
})

// handle messages
ws.on('message', (message) => {
    const data = JSON.parse(message)
    if (data.params?.diagnostics?.length > 0) {
        for (let diagnostic of data.params.diagnostics) {
            console.log('Result:', diagnostic.message)
        }
    }
})
ws.on('error', (e) => console.log('Error:', e.toString()))
