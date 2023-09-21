export enum PaymentStatus {
    PENDING = 'pending',         // Payment has been initiated but not completed
    APPROVED = 'approved',       // Payment has been successfully approved
    DECLINED = 'declined',       // Payment was declined or failed
    REFUNDED = 'refunded',       // Payment was refunded
  }
  