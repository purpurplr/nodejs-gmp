export interface CrudService<M, D> {
  getAll: (login?: string, limit?: number) => Promise<M[]>;
  findByPk: (id: string) => Promise<M | null>;
  create: (user: D) => Promise<M>;
  patch: (pk: string, patchValue: Partial<D>) => Promise<M | -1>;
  delete: (id: string) => Promise<number>;
}
