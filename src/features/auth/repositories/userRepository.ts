import { prisma } from "@/lib/db/prisma";
import type { User, Prisma } from "@prisma/client";

/**
 * Repository layer for the User table.
 * Handles database access only.
 */
export class UserRepository {
  /**
   * Find user details by wallet address.
   */
  static async findByWalletAddress(walletAddress: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        walletAddress: walletAddress.toLowerCase(),
      },
    });
  }

  /**
   * Find user details by unique user ID.
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user with wallet credentials.
   */
  static async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        walletAddress: data.walletAddress.toLowerCase(),
      },
    });
  }

  /**
   * Update active user details.
   */
  static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
