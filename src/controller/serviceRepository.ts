import mongoose, {
  Model,
  FilterQuery,
  UpdateQuery,
  Document,
  QueryOptions,
} from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  filter?: FilterQuery<any>;
}

export const serviceRepository = <T extends Document & { deleted?: boolean }>(
  schema: Model<T>
) => ({
  createEntity: async (entity: Partial<T>): Promise<T> => {
    try {
      return await schema.create(entity);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Create failed");
    }
  },

  getAll: async (): Promise<T[]> => {
    try {
      return await schema.find({ deleted: { $ne: true } }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Get all failed");
    }
  },

  getPaginated: async ({
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    filter = {},
  }: PaginationOptions): Promise<{
    data: T[];
    total: number;
    page: number;
    pages: number;
  }> => {
    try {
      const query = { ...filter, deleted: { $ne: true } };
      const total = await schema.countDocuments(query);
      const pages = Math.ceil(total / limit);
      const data = await schema
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      return { data, total, page, pages };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Pagination failed");
    }
  },

  getSingleById: async (id: string): Promise<T | null> => {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Not a valid ID");
    }
    try {
      return await schema.findOne({ _id: id, deleted: { $ne: true } });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Get by ID failed");
    }
  },

  getSingleEntity: async (query: FilterQuery<T>): Promise<T | null> => {
    try {
      return await schema.findOne({ ...query, deleted: { $ne: true } });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Get one failed");
    }
  },

  updateSingle: async (id: string, updateData: UpdateQuery<T>): Promise<T | null> => {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Not a valid ID");
    }
    try {
      return await schema.findOneAndUpdate(
        { _id: id, deleted: { $ne: true } },
        updateData,
        { new: true }
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Update failed");
    }
  },

  deleteSingle: async (id: string, soft = true): Promise<T | null> => {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error("Not a valid ID");
    }
    try {
      if (soft) {
        return await schema.findByIdAndUpdate(id, { deleted: true }, { new: true });
      }
      return await schema.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Delete failed");
    }
  },
});
// deleted: { type: Boolean, default: false } // or isDeleted
