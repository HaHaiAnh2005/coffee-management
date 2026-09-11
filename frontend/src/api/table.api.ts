import type { Table, Area } from '../types/table';
import { INITIAL_TABLES, INITIAL_AREAS } from '../data/mockData';

export const tableApi = {
  getAllTables: async (): Promise<Table[]> => INITIAL_TABLES,
  getAllAreas: async (): Promise<Area[]> => INITIAL_AREAS,
};
