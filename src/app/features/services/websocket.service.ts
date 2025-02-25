import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private readonly serverUrl = "wss://34.41.30.134:15675/ws";  // RabbitMQ WebSocket URL
  private readonly queueName = "/queue/ordersb";  // ✅ FIXED

  constructor() { }

  connect() {
    if (this.stompClient && this.stompClient.active) {
      console.log("✅ WebSocket already connected.");
      return;
    }

    this.stompClient = new Client({
      brokerURL: this.serverUrl,
      connectHeaders: {
        login: "cafeadmin",  
        passcode: "cafeAdminPWD"
      },
      debug: (msg) => console.log("🐇 RabbitMQ STOMP:", msg),
      reconnectDelay: 5000, // Auto-reconnect after 5s
    });

    this.stompClient.onConnect = () => {
      console.log("✅ WebSocket Connected to RabbitMQ");
    //   this.subscribeToOrders();
    };

    this.stompClient.onStompError = (frame) => {
      console.error("❌ STOMP Error:", frame);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error("🚨 WebSocket Error:", error);
    };

    this.stompClient.activate();
  }

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

  sendAndPublishOrder(order: string) {
    if (!this.stompClient || !this.stompClient.connected) {  // ✅ FIX: Use "connected"
      console.error("❌ WebSocket is not connected. Cannot send order.");
      alert("WebSocket is not connected! Trying to reconnect...");
      this.connect();  // 🔄 Try reconnecting
  
      setTimeout(() => {
        if (this.stompClient.connected) {
          console.log("🚀 Retrying Order:", order);
          this.stompClient.publish({
            destination: this.queueName,
            body: JSON.stringify(order)
          });
          console.log("✅ Order Published After Reconnect:", order);
        } else {
          console.error("❌ Still not connected. Order not sent.");
        }
      }, 2000); // ⏳ Wait 2s before retrying
      return;
    }
  
    console.log("🚀 Sending Order:", order);
    this.stompClient.publish({
      destination: this.queueName,
      body: JSON.stringify(order)
    });
    console.log("✅ Order Published:", order);
  }
  
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("🔌 WebSocket Disconnected");
    }
  }
}
