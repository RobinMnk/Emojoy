import ws from 'ws'

import uuid from 'uuid'

let queue: {ws: ws, id: string}[] = []
let connectionMapping: {[key: string]: string} = {}
let wsMapping: {[key: string]: ws} = {}

interface Message {
  type: 'register' | 'init' | 'offer' | 'answer' | 'userId',
  signal: object | undefined,
  id: string | undefined,
}

function sendUserId(ws: ws, id: string) {
  ws.send(JSON.stringify({
    id: id,
    type: 'userId',
  }))
}

function sendInit(ws: ws, id: string) {
  ws.send(JSON.stringify({
    id: id,
    type: 'init',
  } as Message))
}

function handleSignal(message: Message, type: 'offer' | 'answer') {
  if (!message.id) {
    console.log('no id in payload')
  } else if (!message.signal) {
    console.log('no offer signal in payload')
  } else {
    const reciever = connectionMapping[message.id]
    wsMapping[reciever].send(JSON.stringify({
      type: type,
      id: reciever,
      signal: message.signal,
    } as Message))
  }
}

function handleAnswer(ws: ws, message: Message) {
  handleSignal(message, 'answer')
}

function handleOffer(ws: ws, message: Message) {
  handleSignal(message, 'offer')
}

function handleRegister(ws: ws, message: Message) {
  if(!message.id) {
    message.id = uuid()
    sendUserId(ws, message.id)
  }
  console.log('registered: ', message.id)
  queue.push({ws, id: message.id})
  if (queue.length > 1) {
    const e1 = queue.pop()
    const e2 = queue.pop()
    if (e1 && e2) {
      const {ws: ref1, id: id1} = e1
      const {ws: ref2, id: id2} = e2
      console.log('connecting ', id1, id2)
      connectionMapping[id1] = id2
      connectionMapping[id2] = id1
      wsMapping[id1] = ref1
      wsMapping[id2] = ref2
      sendInit(ref1, id1)
    } else {
      if (e1) {
        queue.push(e1)
      }
      if (e2) {
        queue.push(e2)
      }
    }
  }
}



function onmessage(ws: ws, message: ws.Data) {
  if (!message) {
    console.log('no message')
  }
  let msg;
  try {
    msg = JSON.parse(message as string) as Message
  } catch (err) {
    console.log('could not parse message to json')
    return
  }
  switch(msg.type) {
    case "answer":
      handleAnswer(ws, msg)
      break
    case "register":
      handleRegister(ws, msg)
      break
    case "offer":
      handleOffer(ws, msg)
      break
  }

}

export function init() {
  const wss = new ws.Server({ port: 8080 });
  console.log('create')
  wss.on('connection', ws => {
    console.log('connected')
    ws.on('message', (message) => {
      onmessage(ws, message)
    })
  })
}

init()