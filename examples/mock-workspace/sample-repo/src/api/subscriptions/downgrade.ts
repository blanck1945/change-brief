/**
 * Mock implementation stub — demo only.
 * Real PR #842 / #901 would contain full logic.
 *
 * Public: POST /v1/subscriptions/downgrade
 * - Validates Pro plan
 * - Writes subscription_scheduled_changes
 * - Returns pending_downgrade
 */

export function scheduleDowngrade(_subscriptionId: string): { status: "pending_downgrade" } {
  return { status: "pending_downgrade" };
}
