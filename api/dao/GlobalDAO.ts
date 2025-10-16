import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

/**
 * GlobalDao
 *
 * Generic Data Access Object for performing CRUD operations on a Mongoose model.
 * Provides methods to create, read, update, delete, and retrieve all documents.
 *
 * @template T - The type of the Mongoose document
 */
export default class GlobalDao<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Creates a new document in the database.
   * @async
   * @param data - Data for the new document
   * @returns The created document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error: any) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /**
   * Reads a document by its ID.
   * @async
   * @param id - Document ID
   * @returns The found document
   */
  async read(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id).exec();
      if (!document) throw new Error("Document not found");
      return document;
    } catch (error: any) {
      throw new Error(`Error getting document by ID: ${error.message}`);
    }
  }

  /**
   * Updates a document by its ID.
   * @async
   * @param id - Document ID
   * @param updateData - Data to update
   * @returns The updated document
   */
  async update(id: string, updateData: UpdateQuery<T>): Promise<T> {
    try {
      const updatedDocument = await this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();

      if (!updatedDocument) throw new Error("Document not found");
      return updatedDocument;
    } catch (error: any) {
      throw new Error(`Error updating document by ID: ${error.message}`);
    }
  }

  /**
   * Deletes a document by its ID.
   * @async
   * @param id - Document ID
   * @returns The deleted document
   */
  async delete(id: string): Promise<T> {
    try {
      const deletedDocument = await this.model.findByIdAndDelete(id).exec();
      if (!deletedDocument) throw new Error("Document not found");
      return deletedDocument;
    } catch (error: any) {
      throw new Error(`Error deleting document by ID: ${error.message}`);
    }
  }

  /**
   * Retrieves all documents matching the filter.
   * @async
   * @param filter - Optional query filter
   * @returns Array of documents
   */
  async getAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter).exec();
    } catch (error: any) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }
}