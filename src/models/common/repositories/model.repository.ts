import { plainToClass, ClassConstructor } from 'class-transformer';
import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  EntityTarget,
  EntityManager,
  FindManyOptions,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  IPaginatedResult,
  IPaginationOptions,
} from '../../../common/interfaces/pagination.interface';

export abstract class ModelRepository<T extends ObjectLiteral, K> {
  protected repository: Repository<T>;
  protected manager: EntityManager;
  protected metadata: any;

  constructor(private readonly entityClass: ClassConstructor<K>) {}

  async get(
    id: string,
    relations: string[] = [],
    throwsException = false,
  ): Promise<K | null> {
    const where = { id } as unknown as FindOptionsWhere<T>;
    return await this.repository
      .findOne({
        where,
        relations,
      })
      .then((entity) => {
        if (!entity && throwsException) {
          return Promise.reject(
            new NotFoundException(`Model with ID ${id} not found.`),
          );
        }

        return Promise.resolve(entity ? this.transform(entity) : null);
      })
      .catch((error) => Promise.reject(error));
  }

  async getAll(relations: string[] = []): Promise<K[]> {
    return await this.repository
      .find({ relations })
      .then((entities) => this.transformMany(entities))
      .catch((error) => Promise.reject(error));
  }

  async paginate(
    options: IPaginationOptions = {},
    relations: string[] = [],
    where?: FindOptionsWhere<T>,
  ): Promise<IPaginatedResult<K>> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<T> = {
      relations,
      skip,
      take: limit,
    };

    if (where) {
      findOptions.where = where;
    }

    const [entities, totalItems] =
      await this.repository.findAndCount(findOptions);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: this.transformMany(entities),
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getBy(
    where: FindOptionsWhere<T>,
    relations: string[] = [],
    throwsException = false,
  ): Promise<K | null> {
    return await this.repository
      .findOne({ where, relations })
      .then((entity) => {
        if (!entity && throwsException) {
          return Promise.reject(new NotFoundException('Model not found.'));
        }

        return Promise.resolve(entity ? this.transform(entity) : null);
      })
      .catch((error) => Promise.reject(error));
  }

  async getAllBy(
    where: FindOptionsWhere<T>,
    relations: string[] = [],
  ): Promise<K[]> {
    return await this.repository
      .find({ where, relations })
      .then((entities) => this.transformMany(entities))
      .catch((error) => Promise.reject(error));
  }

  async paginateBy(
    where: FindOptionsWhere<T>,
    options: IPaginationOptions = {},
    relations: string[] = [],
  ): Promise<IPaginatedResult<K>> {
    return this.paginate(options, relations, where);
  }

  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = [],
  ): Promise<K> {
    return this.repository
      .save(inputs)
      .then(async (entity) => {
        const id = (entity as any).id;
        const result = await this.get(id, relations, true);
        return result as K;
      })
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    id: string,
    inputs: QueryDeepPartialEntity<T>,
    relations: string[] = [],
  ): Promise<K> {
    // Primero verificamos que la entidad exista
    const entityExists = await this.get(id, [], true);

    return this.repository
      .update(id, inputs)
      .then(async () => {
        const result = await this.get(id, relations, true);
        return result as K;
      })
      .catch((error) => Promise.reject(error));
  }

  async deleteEntity(id: string): Promise<boolean> {
    // Primero verificamos que la entidad exista
    const entityExists = await this.get(id, [], true);

    return this.repository
      .delete(id)
      .then((result) => {
        return result && result.affected ? result.affected > 0 : false;
      })
      .catch((error) => Promise.reject(error));
  }

  transform(model: T, transformOptions = {}): K {
    return plainToClass(this.entityClass, model, transformOptions) as K;
  }

  transformMany(models: T[], transformOptions = {}): K[] {
    return models.map((model) => this.transform(model, transformOptions));
  }
}
