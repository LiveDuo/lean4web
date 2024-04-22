
const { client: WebSocketClient } = require('websocket')

const client = new WebSocketClient()

client.on('connect', (connection) => {
    
    // init lean
    connection.send(JSON.stringify({ jsonrpc: '2.0', id: 0, method: 'initialize', params: {} }))
    connection.send(JSON.stringify({ jsonrpc: '2.0', method: 'initialized', params:{} }))

    // send code
    const params = { textDocument: { uri: '1', languageId: 'lean4', version: 1, text:'#eval 3+1\n #eval IO.println "hello"' }}
    connection.send(JSON.stringify({ jsonrpc: '2.0', method: 'textDocument/didOpen', params }))

    // handle messages
    connection.on('message', (message) => {
        const data = JSON.parse(message.utf8Data)
        if (data.params?.diagnostics?.length > 0) {
            for (let diagnostic of data.params.diagnostics) {
                console.log('Result:', diagnostic.message)
            }
        }
    })
    connection.on('error', (e) => console.log('Error:', e.toString()))
    
})

client.connect('ws://localhost:8080/websocket/MathlibLatest')
