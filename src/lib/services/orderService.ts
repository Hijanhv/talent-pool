import { db } from '@/db/client';
import { orders, userProfiles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Order, OrderStatus } from '@/types';

export class OrderService {
  static async createOrder(
    gigId: string,
    buyerWalletAddress: string,
    sellerWalletAddress: string,
    priceAgreed: string,
    deliveryDaysFromNow: number
  ): Promise<Order> {
    const deliveryDeadline = new Date();
    deliveryDeadline.setDate(deliveryDeadline.getDate() + deliveryDaysFromNow);

    const newOrderId = crypto.randomUUID();
    await db
      .insert(orders)
      .values({
        id: newOrderId,
        gigId,
        buyerWalletAddress,
        sellerWalletAddress,
        priceAgreed,
        deliveryDeadline,
      });

    const [newOrder] = await db.select().from(orders).where(eq(orders.id, newOrderId));
    return newOrder as Order;
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return (order as Order) || null;
  }

  static async getOrdersByBuyer(buyerWalletAddress: string): Promise<Order[]> {
    const results = await db
      .select()
      .from(orders)
      .where(eq(orders.buyerWalletAddress, buyerWalletAddress))
      .orderBy(desc(orders.createdAt));
    return results as Order[];
  }

  static async getOrdersBySeller(sellerWalletAddress: string): Promise<Order[]> {
    const results = await db
      .select()
      .from(orders)
      .where(eq(orders.sellerWalletAddress, sellerWalletAddress))
      .orderBy(desc(orders.createdAt));
    return results as Order[];
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updateData: any = { status, updatedAt: new Date() };

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId));

    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, orderId));
    return updatedOrder as Order;
  }

  static async recordPayment(orderId: string, txHash: string): Promise<Order> {
    await db
      .update(orders)
      .set({
        paymentTxHash: txHash,
        status: 'in_progress',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    const [updated] = await db.select().from(orders).where(eq(orders.id, orderId));
    return updated as Order;
  }

  static async updateSellerEarnings(sellerWalletAddress: string, amount: string): Promise<void> {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.walletAddress, sellerWalletAddress));

    if (profile.length > 0) {
      const profileData = profile[0]!;
      const currentEarned = parseFloat(profileData.totalEarned || '0') || 0;
      const currentOrders = profileData.totalOrders || 0;
      await db
        .update(userProfiles)
        .set({
          totalEarned: (currentEarned + parseFloat(amount)).toString(),
          totalOrders: currentOrders + 1,
        })
        .where(eq(userProfiles.walletAddress, sellerWalletAddress));
    } else {
      await db.insert(userProfiles).values({
        walletAddress: sellerWalletAddress,
        totalEarned: amount,
        totalOrders: 1,
      });
    }
  }
}
