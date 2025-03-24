import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: CompatClient;
  private isConnected = false;
  private topicSubjects: { [topic: string]: Subject<any> } = {};

  constructor() {}

  connect(): void {
    if (this.isConnected) return;

    const socket = new WebSocket('ws://localhost:8083/ws/websocket'); // 🧠 Change to IP for LAN
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('[WebSocket] Connected ✅');
      this.isConnected = true;

      // Re-subscribe to all existing topics
      Object.keys(this.topicSubjects).forEach(topic => {
        this.subscribeInternal(topic);
      });
    }, (error: any) => {
      console.error('[WebSocket] Connection error:', error);
      this.isConnected = false;
    });
  }

  subscribeToTopic<T = any>(topic: string): Observable<T> {
    if (!this.topicSubjects[topic]) {
      this.topicSubjects[topic] = new Subject<T>();

      if (this.isConnected) {
        this.subscribeInternal(topic);
      }
    }

    return this.topicSubjects[topic].asObservable();
  }

  private subscribeInternal(topic: string): void {
    this.stompClient.subscribe(topic, (message: IMessage) => {
      const body = this.tryParse(message.body);
      this.topicSubjects[topic].next(body);
    });
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('[WebSocket] Disconnected');
        this.isConnected = false;
      });
    }
  }

  private tryParse(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }


  // private stompClient!: CompatClient;
  // private messageSubject = new Subject<string>();
  // public messages$ = this.messageSubject.asObservable();

  // constructor() { }
  
  // connect() {
  //   const socket = new WebSocket('ws://localhost:8083/ws/websocket'); // 🔁 Use IP if accessing from another device
  //   this.stompClient = Stomp.over(socket);

  //   this.stompClient.connect({}, () => {
  //     console.log('[WebSocket] Connected ✅');

  //     this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
  //       console.log('[WebSocket] Message:', message.body);
  //       this.messageSubject.next(message.body);
  //     });
  //   }, (error: any) => {
  //     console.error('[WebSocket] Connection error:', error);
  //   });
  // }

  // disconnect() {
  //   if (this.stompClient && this.stompClient.connected) {
  //     this.stompClient.disconnect(() => {
  //       console.log('[WebSocket] Disconnected');
  //     });
  //   }
  // }
  


  // no longer needed till 74
  // connect() {
  //   if (this.stompClient && this.stompClient.active) {
  //     console.log("✅ WebSocket already connected.");
  //     return;
  //   }

  //   this.stompClient = new Client({
  //     brokerURL: this.serverUrl,
  //     connectHeaders: {
  //       login: "cafeadmin",  
  //       passcode: "cafeAdminPWD"
  //     },
  //     debug: (msg) => console.log("🐇 RabbitMQ STOMP:", msg),
  //     reconnectDelay: 5000, // Auto-reconnect after 5s
  //   });

  //   this.stompClient.onConnect = () => {
  //     console.log("✅ WebSocket Connected to RabbitMQ");
  //   //   this.subscribeToOrders();
  //   };

  //   this.stompClient.onStompError = (frame) => {
  //     console.error("❌ STOMP Error:", frame);
  //   };

  //   this.stompClient.onWebSocketError = (error) => {
  //     console.error("🚨 WebSocket Error:", error);
  //   };

  //   this.stompClient.activate();
  // }

//   subscribeToOrders() {
//     if (!this.stompClient || !this.stompClient.active) {
//       console.error("❌ WebSocket is not connected. Cannot subscribe.");
//       return;
//     }

//     this.stompClient.subscribe(this.queueName, (message) => {
//       console.log("📩 New Order Received:", message.body);
//       alert(`🛒 New Order Received: ${message.body}`);
//     });

//     console.log("🔔 Subscribed to Order Queue:", this.queueName);
//   }

//   sendMessage(order: string) {
//     if (!this.stompClient || !this.stompClient.active) {
//       console.error("❌ WebSocket is not connected. Cannot send message.");
//       return;
//     }

//     this.stompClient.publish({
//       destination: this.queueName,
//       body: order
//     });

//     console.log("📨 Order Sent:", order);
//   }

  /**
   * ✅ New Method: Send Order & Immediately Subscribe
   */
//   sendAndPublishOrderOld(order: string) {
//     if (!this.stompClient || !this.stompClient.active) {
//       console.error("❌ WebSocket is not connected. Cannot send order.");
//       return;
//     }

//     console.log("🚀 Sending Order:", order);

//     // Publish the order
//     this.stompClient.publish({
//       destination: this.queueName,
//       body: JSON.stringify(order)
//     });

//     console.log("✅ Order Published:", order);
// alert("order publisheddd");
//     // Subscribe after sending (useful to ensure we listen for responses)
//     // this.subscribeToOrders();
//   }


    // below all commented now eliminated all
  // sendAndPublishOrder(order: string) {
  //   if (!this.stompClient || !this.stompClient.connected) {  // ✅ FIX: Use "connected"
  //     console.error("❌ WebSocket is not connected. Cannot send order.");
  //     alert("WebSocket is not connected! Trying to reconnect...");
  //     this.connect();  // 🔄 Try reconnecting
  
  //     setTimeout(() => {
  //       if (this.stompClient.connected) {
  //         console.log("🚀 Retrying Order:", order);
  //         this.stompClient.publish({
  //           destination: this.queueName,
  //           body: JSON.stringify(order)
  //         });
  //         console.log("✅ Order Published After Reconnect:", order);
  //       } else {
  //         console.error("❌ Still not connected. Order not sent.");
  //       }
  //     }, 2000); // ⏳ Wait 2s before retrying
  //     return;
  //   }
  
  //   console.log("🚀 Sending Order:", order);
  //   this.stompClient.publish({
  //     destination: this.queueName,
  //     body: JSON.stringify(order)
  //   });
  //   console.log("✅ Order Published:", order);
  // }
  
  // disconnect() {
  //   if (this.stompClient) {
  //     this.stompClient.deactivate();
  //     console.log("🔌 WebSocket Disconnected");
  //   }
  // }
}
