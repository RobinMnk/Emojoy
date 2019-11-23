import { getCookies, setCookie } from "../util/util"
import Peer from 'simple-peer'

interface Message {
  type: 'register' | 'init' | 'offer' | 'answer' | 'userId',
  signal: object | undefined,
  id: string | undefined,
}

const decoder = new TextDecoder("utf-8");


type StreamCB = (stream: MediaStream) => void
type DataCB = (data: any) => void

export class Connection {
  ws: WebSocket | undefined;
  peer: Peer.Instance | undefined;
  id: string | undefined;
  onStream: StreamCB
  outstream: MediaStream
  instream: MediaStream | undefined
  player: 'A' | 'B' | undefined

  constructor(onStream: StreamCB, stream: MediaStream, onData: DataCB) {
    this.onStream = stream => {
      this.instream = stream
      onStream(stream)
    }
    this.outstream = stream
    this.init()
  }

  init = () => {
    const ws = new WebSocket("ws://localhost:8080")
    this.ws = ws
    const userId = getCookies()['USER_ID'];
      ws.onmessage = this.handleMessages
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: userId,
          type: 'register',
        } as Message))
      }
  }

  getId = () => {
    if (!this.id) {
      this.id = getCookies()['USER_ID']
    }
    return this.id
  }

  onData = data => {
    data = decoder.decode(data)
    console.log(data)
  }

  sendData(data: object) {
    const peer = this.peer
    if (!peer) {
      console.log('no peer connection, can not send data')
    } else {
      peer.send(JSON.stringify(data))
    }
  }

  handleAnswer = (message: Message) => {
    if (!this.peer) {
      console.log('no peer created')
    } else if (!message.signal) {
      console.log('no offer in payload')
    } else {
      this.peer.signal(message.signal)
    }
  }

  handleSignal = (data: any) => {
    console.log('in signal')
    const ws = this.ws
    if (ws && (data.type == 'answer' || data.type === 'offer')) {
      console.log('in signal if')
      ws.send(JSON.stringify({
        id: this.getId(),
        type: data.type,
        signal: data,
      } as Message))
    }
  }
  

  handleOffer = (message: Message) => {
    if (this.peer) {
      console.log('alreadt a rtc client created')
    } else if (!message.signal) {
      console.log('no offer in payload')
    } else {
      const ws = this.ws
      this.peer = new Peer()
      this.peer.on('signal', this.handleSignal)
      this.peer.on('stream', this.onStream)
      this.peer.on('data', this.onData)
      this.peer.signal(message.signal)
      this.peer.addStream(this.outstream)
      this.player = 'B'
    }
  }

  handleInit = (message: Message) => {
    const ws = this.ws
    console.log('in init')
    if (ws) {
      console.log('in init if')
      this.peer = new Peer({ initiator: true });
      this.peer.on('signal', this.handleSignal)
      this.peer.on('stream', this.onStream)
      this.peer.on('data', this.onData)
      this.peer.addStream(this.outstream)
      this.player = 'A'
    }
  }

  handleUserId = (message: Message) => {
    if (!message.id) {
      console.log('No user id send')
    } else {
      setCookie('USER_ID', message.id)
    }
  }

  handleMessages = (message: MessageEvent) => {
    console.log(message)
    const msg = JSON.parse(message.data) as Message
    switch(msg.type) {
      case "answer":
        this.handleAnswer(msg)
        break
      case "userId":
        this.handleUserId(msg)
        break
      case "offer":
        this.handleOffer(msg)
        break
      case "init":
        this.handleInit(msg)
        break
    }
  }
}