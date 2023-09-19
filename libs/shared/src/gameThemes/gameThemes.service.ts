import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, DeleteResult, UpdateResult, Like } from 'typeorm';

import { GameThemesDto } from './gameThemes.dto';
import { GameThemes } from './gameThemes.entity';

import { GlobalService } from '../core/config/global.service';

import { v4 as uuidv4 } from 'uuid';
import { handleError, handleErrors } from '../common/errorHandling';

@Injectable()
export class GameThemesService {
  constructor(
    @InjectRepository(GameThemes)
    private readonly repository: Repository<GameThemes>,
  ) { }

  async create(gameThemesDto: GameThemesDto[],type?: string): Promise<GameThemesDto[]> {
    try {
      const promises = (JSON.parse(JSON.stringify(gameThemesDto))).data.map(async (items: GameThemesDto) => {
        items.id = uuidv4();
        let provider = this.getGameThemeAsEntity(items);
        let saved = await this.repository.save(provider);
        return saved
      })

      const savedProviders = await Promise.all(promises);
      const all = this.getGameThemesAsDto(savedProviders)
      return all
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
      if (error.code === 'ER_DUP_ENTRY') {
         const errorMessage = `Error: Game theme already exists.`;
        throw new HttpException(errorMessage, HttpStatus.CONFLICT, { cause: new Error(errorMessage) });
      }

      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST, { cause: new Error('field are empty') });

      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });
    }

  }


  async findAll(): Promise<GameThemesDto[]> {
    const res = await this.repository.find()
    return this.getGameThemesAsDto(res)
  }


  async SearchGamesThemes(param: { searchQuery: string, limit: number }): Promise<GameThemesDto[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('GameThemes');
      const entities = await queryBuilder
        .where('GameThemes.gameTheme LIKE :gameTheme', { gameTheme: `%${param.searchQuery}%` })
        .orWhere('GameThemes.id LIKE :gameTheme', { gameTheme: `%${param.searchQuery}%` })
        .take(param.limit)
        .getMany();
      return this.getGameThemesAsDto(entities)
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, { cause: new Error(error) });

    }
  }

  async findById(id: string,type?: string): Promise<GameThemesDto> {
    const res = await this.repository.findOne({ where: { id: id } })
    if (type == "api") {
      if (res == null) {
        throw new HttpException(
          "Not found any Data with this ID",
          HttpStatus.BAD_REQUEST
        );
      }
    }
    return this.getGamethemeAsDto(res)
  }

  async update(gameThemesDto: GameThemesDto,type?:string): Promise<GameThemesDto> {
    try {
      let ref = this.getGameThemeAsEntity(gameThemesDto)
      console.log(gameThemesDto,"ref")
  
      const update_res = await this.repository.update(gameThemesDto.id, ref)
  
      if (update_res.affected === 0) {
        throw new HttpException("No record found with the ID", HttpStatus.BAD_REQUEST, { cause: new Error("No record found with the ID") });
      }
      let res = await this.findById(gameThemesDto.id)
      return res
    } catch (error) {
      if (type == "api") {
        handleErrors(error)
      }
       handleError(error)
    }
   
  }


  async delete(id: string,type?:string): Promise<string> {
    try {
      let deleteResult = await this.repository.delete(id);

      if (deleteResult.affected === 0) {
        if (type == "api") {
          throw new HttpException(
            "No record found with the ID",
            HttpStatus.NOT_FOUND
          );
       }
        // If no rows were affected, it means the ID does not match any existing records
        return "error: ID does not exist";
      }

      return "Success: Item with ID " + id + " has been successfully deleted.";
    } catch (error) {
      if (type == "api") {
        handleErrors(error);
      }
      // Handle specific error cases
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        // If the error is due to a foreign key constraint violation
        return "error: The record cannot be deleted because it is referenced by other records";
      }
      // Handle other general errors
      return "error: An error occurred while deleting the record";
    }
  }

  async clear(): Promise<string> {
    if (GlobalService.isTestCase) {
      let items = await this.repository.find();
      for (const item of items) {
        let dr = await this.repository.delete(item.id);
      }
      return 'cleared';
    }
    return 'not cleared';
  }

  getGameThemesAsDto(items: GameThemes[]): Array<GameThemesDto> {
    if (items == null) return null;
    let ret = new Array<GameThemesDto>();
    for (var i = 0; i < items.length; i++) {
      ret.push(this.getGamethemeAsDto(items[i]));
    }
    return ret;
  }

  getGamethemeAsDto(item: GameThemes): GameThemesDto {
    if (item == null) return null;
    let ret = Object.assign(new GameThemesDto(), item);
    return ret;
  }

  getGameThemeAsEntity(gameThemeDto: GameThemesDto): GameThemes {
    if (gameThemeDto == null) return null;
    let provider = Object.assign(new GameThemes(), gameThemeDto);
    return provider;
  }
}
