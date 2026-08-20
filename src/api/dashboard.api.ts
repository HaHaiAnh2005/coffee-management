export interface DashboardStats {
  todayRevenue: number;
  totalOrdersToday: number;
  completedOrdersToday: number;
  occupiedTablesCount: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => ({
    todayRevenue: 1420000,
    totalOrdersToday: 24,
    completedOrdersToday: 22,
    occupiedTablesCount: 4,
  }),
};
